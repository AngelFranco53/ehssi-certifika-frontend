<template>
  <v-row class="mb-4">
    <v-col
      cols="12"
      md="4"
    >
      <RegisteredUsersStat 
        :value="impartCourseStore.getStats.enrolled"
      />
    </v-col>

    <v-col
      cols="12"
      md="4"
    >
      <CourseCompletionStat 
        :value="impartCourseStore.getStats.completed"
      />
    </v-col>

    <v-col
      cols="12"
      md="4"
    >
      <QrAccessStat 
        :value="impartCourseStore.getStats.qr_code"
        @click="showQrDialog = true"
        class="cursor-pointer"
      />
    </v-col>
  </v-row>

  <DataTable 
    :items="impartCourseStore.getPupils"
    @certificate-click="generateCertificate"
  />

  <v-dialog
    v-model="showQrDialog"
    max-width="400"
  >
    <v-card rounded="lg" class="pa-4">
      <v-card-title class="text-2xl font-bold">
        QR del curso
      </v-card-title>

      <v-card-text class="flex justify-center ">
        <v-img
          :src="qrSrc"
          alt="QR del curso"
          width="300"
          height="300"
          contain
        />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="showQrDialog = false">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import CourseCompletionStat from '@/components/impat-courses/details/stats/CourseCompletionStat.vue';
import QrAccessStat from '@/components/impat-courses/details/stats/QrAccessStat.vue';
import RegisteredUsersStat from '@/components/impat-courses/details/stats/RegisteredUsersStat.vue';
import DataTable from '@/components/impat-courses/details/DataTable.vue';

import { usePageHeader } from '@/composables/usePageHeader'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useImpartCourseStore } from '@/stores/impartCourseStore';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const { setPageHeader, clearHeaderAppend } = usePageHeader();
const impartCourseStore = useImpartCourseStore();
const route = useRoute();
const showQrDialog = ref(false);
const movilBasedUrl = 'https://indigo-ferret-156776.hostingersite.com/movil';

const courseLabel = computed(() => {
  const details = impartCourseStore.getCourseDetails ?? {};

  return details.name
    || details.title
    || details.course_name
    || details.activity
    || 'Curso de capacitación';
});

const certificateDate = computed(() => dayjs().format('DD/MM/YYYY'));
const certificateFolio = computed(() => `DC3-${dayjs().format('YYYYMMDD')}-${String(route.params.id ?? '').padStart(4, '0')}`);

const qrSrc = computed(() => {
  const qrValue = impartCourseStore.getStats?.qr_code
    ? `${movilBasedUrl}/${impartCourseStore.getStats.qr_code}`
    : 'https://certifika.app/impart-courses';

  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(qrValue)}`;
});

const createCertificateElement = (student) => {
  console.log(student);
  
  const st = student?.raw ?? student ?? {};
  const name = (st.name || `${st.first_name || ''} ${st.last_name || ''}`).toUpperCase();
  const course = courseLabel.value.toUpperCase();
  const fechaRegistro = st.date || certificateDate.value;
  const fechaEmision = certificateDate.value;
  const folio = certificateFolio.value;

  const wrapper = document.createElement('div');
  wrapper.setAttribute('id', 'cert-print-area');
  wrapper.style.width = '794px';
  wrapper.style.height = '1123px';
  wrapper.style.boxSizing = 'border-box';
  wrapper.style.padding = '24px';
  wrapper.style.background = '#fff';
  wrapper.style.fontFamily = 'Arial, Helvetica, sans-serif';
  wrapper.style.color = '#111';

  wrapper.innerHTML = `
<div>
    <div style="clear:both;">
        <p style="margin-top:0pt; margin-bottom:0pt;">&nbsp;</p>
        <table cellspacing="0" cellpadding="0" style="width:552.9pt; border-collapse:collapse;">
            <tbody>
                <tr style="height:63.75pt;">
                    <td style="width:265.65pt; padding-right:5.4pt; padding-left:5.4pt; vertical-align:top;">
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:12pt;"><img src="data:image/png;base64,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" width="181" height="78" alt="" style="float: left; "></p>
                    </td>
                    <td style="width:265.65pt; padding-right:5.4pt; padding-left:5.4pt; vertical-align:top;">
                        <p style="margin-top:0pt; margin-bottom:0pt; text-align:right; font-size:12pt;"><svg height="78.87" id="Layer_1" overflow="hidden" viewBox="0 0 675.63 351.91" width="151.47" xmlns="http://www.w3.org/2000/svg" style="overflow:hidden;" xmlns:xlink="http://www.w3.org/1999/xlink">&nbsp;<defs>&nbsp;<path d="M601.72 156.92C598.872 156.842 596.077 156.127 593.54 154.83 556.43 135.51 514.33 124.08 473.45 124.08 468.875 124.063 464.301 124.29 459.75 124.76 469.01 138.978 479.059 152.666 489.85 165.76 492.22 168.59 492.92 170.3 492.92 173.04 492.92 177.81 487.92 182.42 482.57 182.42 479.01 182.42 476.89 181.01 473.57 177.14 462.49 164.14 445.85 141.14 437.96 128.01 399.16 134.87 355.9 157.79 330.34 178.01 327.42 180.35 325.34 181.32 322.45 181.32 316.941 181.227 312.475 176.827 312.3 171.32 312.3 168.23 313.44 165.9 317.44 162.57 356.44 130.1 417.04 104.45 468.49 104.45 488.432 104.583 508.285 107.118 527.62 112 542.407 115.857 556.874 120.852 570.89 126.94 532.64 103.82 484.68 82.7 454.35 82.7 446.62 82.7 441.88 85.29 441.88 90.5 441.88 93.57 443.6 97.67 446.14 101.8 439.352 102.45 432.621 103.597 426 105.23 422.84 99.43 420.64 93.23 420.64 86.61 420.64 71.82 430.28 62.72 449.64 62.72 493.64 62.72 567.47 103.72 604.33 133.61 608.55 137.04 612.71 141.29 612.71 146.28 612.516 152.21 607.653 156.918 601.72 156.92Z" fill="#FF3700">&nbsp;<path d="M124 244.09C124 241.45 125.6 239.82 128.05 239.82 130.5 239.82 132.05 241.45 132.05 244.09L132.05 248.54C134.19 244.15 138.94 239.82 143.2 239.82 145.95 239.82 147.28 241.43 147.28 243.57 147.28 245.71 146.14 247.22 142.61 248.21 135.28 250.21 132.07 254.34 132.07 262.21L132.07 285C132.07 287.64 130.52 289.27 128.07 289.27 125.62 289.27 124 287.61 124 285Z" fill="#414141">&nbsp;<path d="M304.31 244.09C304.31 241.45 305.9 239.82 308.36 239.82 310.82 239.82 312.36 241.45 312.36 244.09L312.36 248.54C314.5 244.15 319.25 239.82 323.51 239.82 326.26 239.82 327.59 241.43 327.59 243.57 327.59 245.71 326.45 247.22 322.92 248.21 315.58 250.21 312.38 254.34 312.38 262.21L312.38 285C312.38 287.64 310.83 289.27 308.38 289.27 305.93 289.27 304.33 287.64 304.33 285Z" fill="#414141">&nbsp;<path d="M170.2 239.82C178.05 239.82 183.1 242.97 183.1 245.82 183.156 247.63 181.739 249.145 179.93 249.21 177 249.21 175.61 246.83 170.2 246.83 161.07 246.83 156.39 255 156.39 264.54 156.39 274.88 161.67 282.25 170.2 282.25 176.2 282.25 177.45 279.79 180.25 279.79 181.8 279.72 183.114 280.92 183.184 282.471 183.19 282.614 183.185 282.757 183.17 282.9 183.17 284.72 181.67 286.2 178.96 287.45 176.198 288.656 173.214 289.269 170.2 289.25 156.52 289.25 148.31 278.99 148.31 264.54 148.31 250.39 156.59 239.82 170.2 239.82Z" fill="#414141">&nbsp;<path d="M194.88 267.62C195.03 275.52 200.15 282.24 209.15 282.24 218.6 282.24 220.84 276.94 224.25 276.94 225.971 276.859 227.432 278.188 227.514 279.909 227.52 280.029 227.518 280.15 227.51 280.27 227.51 284.18 218.88 289.27 209.22 289.27 202 289.27 197.15 286.98 193.54 283.32 188.94 278.66 186.8 271.78 186.8 264.56 186.8 251.36 194.98 239.85 208.52 239.85 221.11 239.85 229.27 250.96 229.27 263.38 229.27 266.19 228.13 267.65 224.82 267.65ZM221.22 261.62C221.22 254.72 217.29 246.82 208.48 246.82 199.82 246.82 195.18 253.62 194.88 261.62Z" fill="#414141">&nbsp;<path d="M245.75 285C245.75 287.64 244.19 289.27 241.75 289.27 239.31 289.27 237.75 287.64 237.75 285L237.75 227.74C237.75 225.1 239.33 223.46 241.75 223.46 244.17 223.46 245.75 225.1 245.75 227.74Z" fill="#414141">&nbsp;<path d="M275 289.26C262.21 289.26 253.7 279.07 253.7 264.53 253.7 249.99 262.21 239.8 275 239.8 287.79 239.8 296.29 250 296.29 264.53 296.29 279.06 287.8 289.26 275 289.26ZM275 282.26C282.83 282.26 288.21 275.42 288.21 264.55 288.21 253.68 282.83 246.84 275 246.84 267.17 246.84 261.78 253.68 261.78 264.55 261.78 275.42 267.18 282.24 275 282.24Z" fill="#414141">&nbsp;<path d="M383.39 243.15C378.9 258.56 371.54 283.89 370.93 285.97 370.561 287.997 368.713 289.412 366.66 289.24 364.46 289.24 363.1 288.43 362.39 285.97L349.6 242C348.87 239.49 348.19 236.51 347.68 234 347.37 236.46 346.98 239.34 346.55 242 344.25 256.41 340.69 278.87 339.7 285.21 339.26 288.01 337.84 289.21 335.51 289.21 333.18 289.21 331.92 287.74 331.92 285.4 331.973 284.18 332.124 282.966 332.37 281.77 332.37 281.77 340.43 233.23 341.08 229.52 341.77 225.52 343.82 223.43 347.17 223.43 350.17 223.43 352.51 225.19 353.46 228.43 354.04 230.48 360.54 253.28 364.68 267.69 365.43 270.35 366.2 273.48 366.78 276.31 367.33 273.54 368.05 270.54 368.78 267.95L380.13 228.43C381.07 225.14 383.13 223.43 386.13 223.43 389.28 223.43 391.58 225.43 392.22 229.52 392.82 233.24 400.94 281.77 400.94 281.77 401.184 282.966 401.331 284.18 401.38 285.4 401.38 287.74 399.99 289.21 397.8 289.21 395.61 289.21 394.04 288.02 393.61 285.21 392.61 279.06 389.25 257.67 386.95 243.21 386.48 240.26 386.05 236.92 385.69 233.86 385.13 236.61 384.34 239.89 383.39 243.15Z" fill="#414141">&nbsp;<path d="M415.55 225.65C418.262 225.644 420.464 227.838 420.47 230.55 420.475 233.262 418.282 235.464 415.57 235.47 412.858 235.475 410.656 233.282 410.65 230.57 410.65 230.563 410.65 230.557 410.65 230.55 410.639 227.855 412.815 225.661 415.51 225.65 415.523 225.65 415.537 225.65 415.55 225.65ZM419.55 244.09C419.55 241.45 417.97 239.82 415.55 239.82 413.13 239.82 411.55 241.45 411.55 244.09L411.55 285C411.55 287.64 413.11 289.27 415.55 289.27 417.99 289.27 419.55 287.64 419.55 285Z" fill="#414141">&nbsp;<path d="M433.57 229.91C433.57 227.28 435.13 225.65 437.57 225.65 440.01 225.65 441.57 227.28 441.57 229.91L441.57 240.36 444.84 240.36C447.47 240.36 448.84 241.65 448.84 243.83 448.84 246.01 447.48 247.32 444.84 247.32L441.57 247.32 441.57 285C441.57 287.64 439.99 289.27 437.57 289.27 435.15 289.27 433.57 287.64 433.57 285L433.57 247.32 430.65 247.32C428.02 247.32 426.65 246.01 426.65 243.83 426.65 241.65 428.01 240.36 430.65 240.36L433.57 240.36Z" fill="#414141">&nbsp;<path d="M458.93 229.91C458.93 227.28 460.5 225.65 462.93 225.65 465.36 225.65 466.93 227.28 466.93 229.91L466.93 240.36 470.2 240.36C472.84 240.36 474.2 241.65 474.2 243.83 474.2 246.01 472.84 247.32 470.2 247.32L467 247.32 467 285C467 287.64 465.44 289.27 463 289.27 460.56 289.27 459 287.64 459 285L459 247.32 456 247.32C453.37 247.32 452 246.01 452 243.83 452 241.65 453.36 240.36 456 240.36L458.94 240.36Z" fill="#414141">&nbsp;<path d="M115.39 281.88C113.71 277.38 98 235.15 95.55 228.64 94.33 225.37 92.45 223.46 89.35 223.46 86.25 223.46 84.48 225.37 83.24 228.64 82.13 231.57 65.03 277.39 63.32 281.88 62.7707 283.115 62.4326 284.433 62.32 285.78 62.388 287.762 64.0495 289.313 66.031 289.245 66.064 289.244 66.097 289.242 66.13 289.24 68.0305 289.338 69.7368 288.083 70.21 286.24 70.62 285.11 72.84 278.88 75.68 270.93L103.08 270.93C105.75 278.43 107.91 284.46 108.55 286.24 108.987 288.034 110.614 289.283 112.46 289.24 114.54 289.24 116.46 287.97 116.46 285.88 116.48 285 116.26 284.23 115.39 281.88ZM78.19 263.83C81.52 254.48 85.19 244.26 87.6 237.43 88.28 235.52 88.88 233.71 89.35 232.21 89.86 233.84 90.48 235.69 91.09 237.41L100.51 263.83Z" fill="#414141">&nbsp;<path d="M539.92 285C539.92 287.64 538.34 289.27 535.92 289.27 533.5 289.27 531.92 287.64 531.92 285L531.92 227.74C531.92 225.1 533.48 223.46 535.92 223.46 538.36 223.46 539.92 225.1 539.92 227.74Z" fill="#414141">&nbsp;<path d="M516.49 239.82C514.03 239.82 512.49 241.45 512.49 244.09L512.49 247.7C509.665 242.777 504.406 239.758 498.73 239.8 486.46 239.8 478 250 478 264.53 478 279.06 486.42 289.26 498.67 289.26 504.346 289.302 509.605 286.283 512.43 281.36L512.43 285C512.43 287.64 513.99 289.27 516.43 289.27 518.87 289.27 520.43 287.64 520.43 285L520.43 244.09C520.52 241.45 518.94 239.82 516.49 239.82ZM499.34 282.25C491.5 282.25 486.12 275.4 486.12 264.53 486.12 253.66 491.5 246.81 499.34 246.81 507.18 246.81 512.55 253.66 512.55 264.53 512.55 275.4 507.18 282.25 499.34 282.25Z" fill="#414141">&nbsp;</path>
                                                                                    </path>
                                                                                </path>
                                                                            </path>
                                                                        </path>
                                                                    </path>
                                                                </path>
                                                            </path>
                                                        </path>
                                                    </path>
                                                </path>
                                            </path>
                                        </path>
                                    </path>
                                </defs></svg></p>
                    </td>
                </tr>
            </tbody>
        </table>
        <p style="margin-top:0pt; margin-bottom:0pt;">&nbsp;</p>
    </div>
    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:11pt;"><strong><span style="font-family:Arial;">FORMATO DC-3</span></strong></p>
    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:11pt;"><strong><span style="font-family:Arial;">CONSTANCIA DE COMPETENCIAS O DE HABILIDADES LABORALES</span></strong></p>
    <p style="margin-top:0pt; margin-bottom:0pt; font-size:5pt;">&nbsp;</p>
    <table cellspacing="0" cellpadding="0" style="width:560.7pt; border-collapse:collapse;">
        <tbody>
            <tr style="height:20.6pt;">
                <td colspan="19" style="width:548.45pt; border-style:solid; border-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle; background-color:#000000;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; page-break-after:avoid; font-size:10pt;"><strong><span style="font-family:Arial; color:#ffffff;">DATOS DEL TRABAJADOR</span></strong></p>
                </td>
            </tr>
            <tr style="height:34pt;">
                <td colspan="19" style="width:548.45pt; border-style:solid; border-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:9pt;"><span style="font-family:'Arial Narrow';">Nombre (Anotar apellido paterno, apellido materno y nombre (s))</span></p>
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:2.5pt;"><span style="font-family:'Arial Narrow';">&nbsp;</span></p>
                    <p style="margin-top:0pt; margin-bottom:2pt; font-size:11pt;"><span style="font-family:'Arial Narrow';">${student.name || 'N/A'}</span></p>
                </td>
            </tr>
            <tr style="height:11.35pt;">
                <td colspan="18" style="width:264.35pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:9pt;"><span style="font-family:'Arial Narrow';">Clave &Uacute;nica de Registro de Poblaci&oacute;n</span></p>
                </td>
                <td rowspan="2" style="width:272.6pt; border-style:solid; border-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:9pt;"><span style="font-family:'Arial Narrow';">Ocupaci&oacute;n espec&iacute;fica (Cat&aacute;logo Nacional de Ocupaciones)</span><span style="font-family:'Arial Narrow'; font-size:8pt;">&nbsp;</span><span style="font-family:'Arial Narrow'; font-size:5.33pt;"><sup>1/</sup></span></p>
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:4pt;"><span style="font-family:'Arial Narrow';">&nbsp;</span></p>
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:12pt;"><strong><span style="font-family:'Arial Narrow'; color:#4b4f58;">${impartCourseStore.getCompany?.activity || 'N/A'}</span></strong></p>
                </td>
            </tr>
            <tr style="height:15.6pt;">
                <td style="width:8.85pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;"><strong><span style="font-family:Consolas;">${student.curp.substring(0, 1)}</span></strong></p>
                </td>
                <td style="width:2.7pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${student.curp.substring(1, 2)}</span></strong></p>
                </td>
                <td style="width:2.65pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${student.curp.substring(2, 3)}</span></strong></p>
                </td>
                <td style="width:3.6pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${student.curp.substring(3, 4)}</span></strong></p>
                </td>
                <td style="width:2.7pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${student.curp.substring(4, 5)}</span></strong></p>
                </td>
                <td style="width:2.65pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${student.curp.substring(5, 6)}</span></strong></p>
                </td>
                <td style="width:2.7pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${student.curp.substring(6, 7)}</span></strong></p>
                </td>
                <td style="width:2.65pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;"><strong><span style="font-family:Consolas;">${student.curp.substring(7, 8)}</span></strong></p>
                </td>
                <td style="width:2.7pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${student.curp.substring(8, 9)}</span></strong></p>
                </td>
                <td style="width:2.65pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;"><strong><span style="font-family:Consolas;">${student.curp.substring(9, 10)}</span></strong></p>
                </td>
                <td style="width:2.7pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${student.curp.substring(10, 11)}</span></strong></p>
                </td>
                <td style="width:2.65pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${student.curp.substring(11, 12)}</span></strong></p>
                </td>
                <td style="width:2.7pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;"><strong><span style="font-family:Consolas;">${student.curp.substring(12, 13)}</span></strong></p>
                </td>
                <td style="width:9.75pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;"><strong><span style="font-family:Consolas;">${student.curp.substring(13, 14)}</span></strong></p>
                </td>
                <td style="width:2.65pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${student.curp.substring(14, 15)}</span></strong></p>
                </td>
                <td style="width:2.7pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${student.curp.substring(15, 16)}</span></strong></p>
                </td>
                <td style="width:2.65pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${student.curp.substring(16, 17)}</span></strong></p>
                </td>
                <td style="width:9.2pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;"><strong><span style="font-family:Consolas;">${student.curp.substring(17, 18)}</span></strong></p>
                </td>
            </tr>
            <tr style="height:25.5pt;">
                <td colspan="19" style="width:548.45pt; border-style:solid; border-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:9pt;"><span style="font-family:'Arial Narrow';">Puesto*</span></p>
                    <p style="margin-top:0pt; margin-bottom:2pt; font-size:9pt;"><strong><span style="font-family:'Arial Narrow';">${st.position}</span></strong></p>
                </td>
            </tr>
        </tbody>
    </table>
    <p style="margin-top:0pt; margin-bottom:0pt; font-size:5pt;">&nbsp;</p>
    <table cellspacing="0" cellpadding="0" style="width:560.7pt; border-collapse:collapse;">
        <tbody>
            <tr style="height:20.6pt;">
                <td colspan="19" style="width:548.45pt; border-style:solid; border-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle; background-color:#000000;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; page-break-after:avoid; font-size:10pt;"><strong><span style="font-family:Arial; color:#ffffff;">DATOS DE LA EMPRESA</span></strong></p>
                </td>
            </tr>
            <tr style="height:34pt;">
                <td colspan="19" style="width:548.45pt; border-style:solid; border-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:9pt;"><span style="font-family:'Arial Narrow';">Nombre o raz&oacute;n social (En caso de persona f&iacute;sica, anotar apellido paterno, apellido materno y nombre(s))</span></p>
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:2.5pt;"><span style="font-family:'Arial Narrow';">&nbsp;</span></p>
                    <p style="margin-top:0pt; margin-bottom:2pt; font-size:11pt;"><strong><span style="font-family:'Arial Narrow';">${impartCourseStore.getCompany?.name || 'N/A'}</span></strong></p>
                </td>
            </tr>
            <tr style="height:11.35pt;">
                <td colspan="18" style="width:264.35pt; border-left-style:solid; border-left-width:0.75pt; padding-right:5.75pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:9pt;"><span style="font-family:'Arial Narrow';">Registro Federal de Contribuyentes con homoclave (SHCP)</span></p>
                </td>
                <td rowspan="2" style="width:272.6pt; border-top-style:solid; border-top-width:0.75pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:9pt;"><span style="font-family:'Arial Narrow';">&nbsp;</span></p>
                </td>
            </tr>
            <tr style="height:15.6pt;">
                <td style="width:8.85pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:2pt; font-size:9pt;"><strong><span style="font-family:Consolas;">${impartCourseStore.getCompany?.rfc.substring(0, 1) || 'N/A'}</span></strong></p>
                </td>
                <td style="width:2.7pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${impartCourseStore.getCompany?.rfc.substring(1, 2) || 'N/A'}</span></strong></p>
                </td>
                <td style="width:2.65pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${impartCourseStore.getCompany?.rfc.substring(2, 3) || 'N/A'}</span></strong></p>
                </td>
                <td style="width:3.6pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${impartCourseStore.getCompany?.rfc.substring(3, 4) || 'N/A'}</span></strong></p>
                </td>
                <td style="width:2.7pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${impartCourseStore.getCompany?.rfc.substring(4, 5) || 'N/A'}</span></strong></p>
                </td>
                <td style="width:2.65pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${impartCourseStore.getCompany?.rfc.substring(5, 6) || 'N/A'}</span></strong></p>
                </td>
                <td style="width:2.7pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${impartCourseStore.getCompany?.rfc.substring(6, 7) || 'N/A'}</span></strong></p>
                </td>
                <td style="width:2.65pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${impartCourseStore.getCompany?.rfc.substring(7, 8) || 'N/A'}</span></strong></p>
                </td>
                <td style="width:2.7pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${impartCourseStore.getCompany?.rfc.substring(8, 9) || 'N/A'}</span></strong></p>
                </td>
                <td style="width:2.65pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${impartCourseStore.getCompany?.rfc.substring(9, 10) || 'N/A'}</span></strong></p>
                </td>
                <td style="width:2.7pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${impartCourseStore.getCompany?.rfc.substring(10, 11) || 'N/A'}</span></strong></p>
                </td>
                <td style="width:2.65pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${impartCourseStore.getCompany?.rfc.substring(11, 12) || 'N/A'}</span></strong></p>
                </td>
                <td style="width:2.7pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${impartCourseStore.getCompany?.rfc.substring(12, 13) || 'N/A'}</span></strong></p>
                </td>
                <td style="width:9.75pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">&nbsp;</span></strong></p>
                </td>
                <td style="width:2.65pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:9pt;"><strong><span style="font-family:Consolas;">&nbsp;</span></strong></p>
                </td>
                <td style="width:2.7pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.75pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:9pt;"><span style="font-family:'Arial Narrow';">&nbsp;</span></p>
                </td>
                <td style="width:2.65pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.75pt; padding-left:5.75pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:9pt;"><span style="font-family:'Arial Narrow';">&nbsp;</span></p>
                </td>
                <td style="width:9.2pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.75pt; padding-left:5.75pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:9pt;"><span style="font-family:'Arial Narrow';">&nbsp;</span></p>
                </td>
            </tr>
        </tbody>
    </table>
    <p style="margin-top:0pt; margin-bottom:0pt; font-size:5pt;">&nbsp;</p>
    <table cellspacing="0" cellpadding="0" style="width:557.25pt; border:0.75pt solid #000000; border-collapse:collapse;">
        <tbody>
            <tr style="height:20.6pt;">
                <td colspan="20" style="width:545pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle; background-color:#000000;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; page-break-after:avoid; font-size:10pt;"><strong><span style="font-family:Arial; color:#ffffff;">DATOS DEL PROGRAMA DE CAPACITACI&Oacute;N, ADIESTRAMIENTO Y PRODUCTIVIDAD</span></strong></p>
                </td>
            </tr>
            <tr style="height:24.65pt;">
                <td colspan="20" style="width:545pt; border-top-style:solid; border-top-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:9pt;"><span style="font-family:'Arial Narrow';">Nombre del curso</span></p>
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:2.5pt;"><span style="font-family:'Arial Narrow';">&nbsp;</span></p>
                    <p style="margin-top:0pt; margin-bottom:2pt; font-size:10pt;"><strong><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.impart_course_name || 'N/A'}</span></strong></p>
                </td>
            </tr>
            <tr style="height:10.35pt;">
                <td rowspan="2" style="width:144.5pt; border-top-style:solid; border-top-width:0.75pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;"><span style="font-family:'Arial Narrow';">Duraci&oacute;n en horas</span></p>
                    <p style="margin-top:0pt; margin-bottom:2pt; font-size:12pt;"><strong><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.duration || 'N/A'}</span></strong></p>
                </td>
                <td rowspan="2" style="width:36.5pt; border-top-style:solid; border-top-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.75pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:9pt;"><span style="font-family:'Arial Narrow';">Periodo de</span></p>
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:9pt;"><span style="font-family:'Arial Narrow';">ejecuci&oacute;n:</span></p>
                </td>
                <td style="width:11pt; border-top-style:solid; border-top-width:0.75pt; border-right-style:solid; border-right-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:9pt;"><span style="font-family:'Arial Narrow';">&nbsp;</span></p>
                </td>
                <td colspan="4" style="width:51.5pt; border-top-style:solid; border-top-width:0.75pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:'Arial Narrow';">A&ntilde;o</span></strong></p>
                </td>
                <td colspan="2" style="width:30.5pt; border-top-style:solid; border-top-width:0.75pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:'Arial Narrow';">Mes</span></strong></p>
                </td>
                <td colspan="2" style="width:30.5pt; border-top-style:solid; border-top-width:0.75pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:'Arial Narrow';">D&iacute;a</span></strong></p>
                </td>
                <td style="width:9.5pt; border-top-style:solid; border-top-width:0.75pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:'Arial Narrow';">&nbsp;</span></strong></p>
                </td>
                <td colspan="4" style="width:66.5pt; border-top-style:solid; border-top-width:0.75pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:'Arial Narrow';">A&ntilde;o</span></strong></p>
                </td>
                <td colspan="2" style="width:30.5pt; border-top-style:solid; border-top-width:0.75pt; border-right-style:solid; border-right-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:'Arial Narrow';">Mes</span></strong></p>
                </td>
                <td colspan="2" style="width:30.5pt; border-top-style:solid; border-top-width:0.75pt; border-left-style:solid; border-left-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"><strong><span style="font-family:'Arial Narrow';">D&iacute;a</span></strong></p>
                </td>
            </tr>
            <tr style="height:14.1pt;">
                <td style="width:11pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:bottom;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:9pt;"><span style="font-family:'Arial Narrow';">De</span></p>
                </td>
                <td style="width:4.25pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:12pt;"><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.start_date?.substring(0, 1) || 'N/A'}</span></p>
                </td>
                <td style="width:4.25pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:12pt;"><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.start_date?.substring(1, 2) || 'N/A'}</span></p>
                </td>
                <td style="width:4.25pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:12pt;"><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.start_date?.substring(2, 3) || 'N/A'}</span></p>
                </td>
                <td style="width:4.25pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:12pt;"><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.start_date?.substring(3, 4) || 'N/A'}</span></p>
                </td>
                <td style="width:9.5pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:12pt;"><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.start_date?.substring(5, 6) || 'N/A'}</span></p>
                </td>
                <td style="width:9.5pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:12pt;"><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.start_date?.substring(6, 7) || 'N/A'}</span></p>
                </td>
                <td style="width:9.5pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:12pt;"><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.start_date?.substring(8, 9) || 'N/A'}</span></p>
                </td>
                <td style="width:9.5pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:12pt;"><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.start_date?.substring(9, 10) || 'N/A'}</span></p>
                </td>
                <td style="width:9.5pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:12pt;"><span style="font-family:'Arial Narrow';">a</span></p>
                </td>
                <td style="width:8pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:12pt;"><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.end_date?.substring(0, 1) || 'N/A'}</span></p>
                </td>
                <td style="width:8pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:12pt;"><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.end_date?.substring(1, 2) || 'N/A'}</span></p>
                </td>
                <td style="width:8pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:12pt;"><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.end_date?.substring(2, 3) || 'N/A'}</span></p>
                </td>
                <td style="width:8pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:12pt;"><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.end_date?.substring(3, 4) || 'N/A'}</span></p>
                </td>
                <td style="width:9.5pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:12pt;"><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.end_date?.substring(5, 6) || 'N/A'}</span></p>
                </td>
                <td style="width:9.5pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:12pt;"><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.end_date?.substring(6, 7) || 'N/A'}</span></p>
                </td>
                <td style="width:9.5pt; border-right-style:solid; border-right-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:12pt;"><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.end_date?.substring(8, 9) || 'N/A'}</span></p>
                </td>
                <td style="width:9.5pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:12pt;"><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.end_date?.substring(9, 10) || 'N/A'}</span></p>
                </td>
            </tr>
            <tr style="height:24.65pt;">
                <td colspan="20" style="width:545pt; border-top-style:solid; border-top-width:0.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:9pt;"><span style="font-family:'Arial Narrow';">&Aacute;rea tem&aacute;tica del curso&nbsp;</span><span style="font-family:'Arial Narrow'; font-size:5.33pt;"><sup>2/</sup></span><span style="font-family:'Arial Narrow';">&nbsp;</span></p>
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:3pt;"><span style="font-family:'Arial Narrow';">&nbsp;</span></p>
                    <p style="margin-top:0pt; margin-bottom:2pt; font-size:9pt;"><strong><span style="font-family:Consolas;">${impartCourseStore.getCourseDetails?.name || 'N/A'}</span></strong></p>
                </td>
            </tr>
            <tr style="height:24.65pt;">
                <td colspan="20" style="width:545pt; border-top-style:solid; border-top-width:0.75pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:9pt;"><span style="font-family:'Arial Narrow';">Nombre del agente capacitador o STPS&nbsp;</span><span style="font-family:'Arial Narrow'; font-size:6pt;"><sup>3/</sup></span></p>
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:3pt;"><span style="font-family:'Arial Narrow';">&nbsp;</span></p>
                    <p style="margin-top:0pt; margin-bottom:2pt; font-size:11pt;"><span style="font-family:'Arial Narrow';">${impartCourseStore.getCourseDetails?.teacher || 'N/A'}</span></p>
                </td>
            </tr>
        </tbody>
    </table>
    <p style="margin-top:0pt; margin-bottom:0pt; font-size:5pt;">&nbsp;</p>
    <table cellspacing="0" cellpadding="0" style="width:560.65pt; border:0.75pt solid #000000; border-collapse:collapse;">
        <tbody>
            <tr style="height:40.7pt;">
                <td colspan="7" style="width:548.4pt; padding-right:5.38pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:3pt;"><strong><span style="font-family:'Arial Narrow';">&nbsp;</span></strong></p>
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:12pt;"><strong><span style="font-family:'Arial Narrow';">Los datos se asientan en esta constancia bajo protesta de decir verdad, apercibidos de la responsabilidad en que incurre todo aquel que no se conduce con verdad.</span></strong></p>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="width:165.45pt; padding-right:5.75pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:9pt;"><span style="font-family:'Arial Narrow';">Instructor o tutor</span></p>
                </td>
                <td style="width:2.6pt; padding-right:5.75pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:4pt;"><span style="font-family:'Arial Narrow';">&nbsp;</span></p>
                </td>
                <td style="width:172.85pt; padding-right:5.75pt; padding-left:5.75pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:9pt;"><span style="font-family:'Arial Narrow';">Patr&oacute;n o representante legal&nbsp;</span><span style="font-family:'Arial Narrow'; font-size:6pt;"><sup>4/</sup></span></p>
                </td>
                <td style="width:2.75pt; padding-right:5.75pt; padding-left:5.75pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:9pt;"><span style="font-family:'Arial Narrow';">&nbsp;</span></p>
                </td>
                <td colspan="2" style="width:158.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:9pt;"><span style="font-family:'Arial Narrow';">Representante de los trabajadores&nbsp;</span><span style="font-family:'Arial Narrow'; font-size:6pt;"><sup>5/</sup></span></p>
                </td>
            </tr>
            <tr style="height:31.2pt;">
                <td colspan="2" style="width:158.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:bottom;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:10pt;"></p>
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:10pt;"><strong><span style="font-family:Consolas;">${impartCourseStore.getCourseDetails.teacher}</span></strong></p>
                </td>
                <td style="width:2.6pt; padding-right:5.75pt; padding-left:5.75pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:3pt;">&nbsp;</p>
                </td>
                <td style="width:172.85pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.75pt; padding-left:5.75pt; vertical-align:bottom;">
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:9pt;"><strong><span style="font-family:Consolas;">${impartCourseStore.getCourseDetails.company_supervisor}</span></strong><strong><span style="font-family:Consolas;">&nbsp;</span></strong><strong><span style="font-family:Consolas;">&nbsp;</span></strong><strong><span style="font-family:Consolas;">&nbsp;</span></strong><strong><span style="font-family:Consolas;">&nbsp;</span></strong><strong><span style="font-family:Consolas;">&nbsp;</span></strong></p>
                </td>
                <td style="width:2.75pt; padding-right:5.75pt; padding-left:5.75pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:4pt;">&nbsp;</p>
                </td>
                <td colspan="2" style="width:158.75pt; border-bottom-style:solid; border-bottom-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:bottom;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:9pt;"><strong><span style="font-family:Consolas;">&nbsp;</span></strong></p>
                    <p style="margin-top:0pt; margin-bottom:2pt; text-align:center; font-size:9pt;"><strong><span style="font-family:Consolas;">${impartCourseStore.getCourseDetails.personnel_supervisor}</span></strong></p>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="width:165.45pt; padding-right:5.75pt; padding-left:5.38pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:9pt;"><span style="font-family:'Arial Narrow';">Nombre y firma</span></p>
                </td>
                <td style="width:2.6pt; padding-right:5.75pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:4pt;"><span style="font-family:'Arial Narrow';">&nbsp;</span></p>
                </td>
                <td style="width:172.85pt; border-top-style:solid; border-top-width:0.75pt; padding-right:5.75pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:9pt;"><span style="font-family:'Arial Narrow';">Nombre y firma</span></p>
                </td>
                <td style="width:2.75pt; padding-right:5.75pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:9pt;"><span style="font-family:'Arial Narrow';">&nbsp;</span></p>
                </td>
                <td colspan="2" style="width:158.75pt; border-top-style:solid; border-top-width:0.75pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:middle;">
                    <p style="margin-top:0pt; margin-bottom:0pt; text-align:center; font-size:9pt;"><span style="font-family:'Arial Narrow';">Nombre y firma</span></p>
                </td>
            </tr>
            <tr style="height:2.85pt;">
                <td style="width:24.75pt; padding-right:5.75pt; padding-left:5.38pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:7pt;">&nbsp;</p>
                </td>
                <td style="width:129.2pt; padding-right:5.75pt; padding-left:5.75pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:7pt;">&nbsp;</p>
                </td>
                <td style="width:2.6pt; padding-right:5.75pt; padding-left:5.75pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:3pt;">&nbsp;</p>
                </td>
                <td style="width:172.85pt; padding-right:5.75pt; padding-left:5.75pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:7pt;">&nbsp;</p>
                </td>
                <td style="width:2.75pt; padding-right:5.75pt; padding-left:5.75pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:7pt;">&nbsp;</p>
                </td>
                <td style="width:115.1pt; padding-right:5.75pt; padding-left:5.75pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:7pt;">&nbsp;</p>
                </td>
                <td style="width:32.15pt; padding-right:5.38pt; padding-left:5.75pt; vertical-align:top;">
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:7pt;">&nbsp;</p>
                </td>
            </tr>
        </tbody>
    </table>
    <p style="margin-top:0pt; margin-left:18pt; margin-bottom:0pt; text-indent:-18pt; font-size:1pt;"><strong><span style="font-family:'Arial Narrow';">&nbsp;</span></strong></p>
    <p style="margin-top:0pt; margin-bottom:0pt; font-size:5pt;"><strong><span style="font-family:'Arial Narrow';">&nbsp;</span></strong></p>
    <p style="margin-top:0pt; margin-bottom:0pt; font-size:9pt;"><strong><span style="font-family:'Arial Narrow';">INSTRUCCIONES</span></strong></p>
    <p style="margin-top:0pt; margin-left:28.35pt; margin-bottom:0pt; text-indent:-28.35pt; font-size:8pt;"><span style="font-family:'Arial Narrow';">&nbsp;&nbsp;&nbsp;</span><span style="font-family:'Arial Narrow';">-</span><span style="font-family:'Arial Narrow';">&nbsp;&nbsp;</span><span style="font-family:'Arial Narrow';">Llenar a m&aacute;quina o con letra de molde.</span></p>
    <p style="margin-top:0pt; margin-left:28.35pt; margin-bottom:0pt; text-indent:-28.35pt; font-size:8pt;"><span style="font-family:'Arial Narrow';">&nbsp;&nbsp;&nbsp;</span><span style="font-family:'Arial Narrow';">-</span><span style="font-family:'Arial Narrow';">&nbsp;&nbsp;</span><span style="font-family:'Arial Narrow';">Deber&aacute; entregarse al trabajador dentro de los veinte d&iacute;as h&aacute;biles siguientes al t&eacute;rmino del curso de capacitaci&oacute;n aprobado.</span></p>
    <p style="margin-top:0pt; margin-left:28.35pt; margin-bottom:0pt; text-indent:-28.35pt;"><u><span style="font-family:'Arial Narrow'; font-size:5.33pt;"><sup>1</sup></span></u><span style="font-family:'Arial Narrow'; font-size:5.33pt;"><sup>/</sup></span><span style="font-family:'Arial Narrow'; font-size:8pt;">&nbsp;&nbsp;&nbsp;</span><span style="font-family:'Arial Narrow'; font-size:8pt;">Las &aacute;reas y sub&aacute;reas ocupacionales del Cat&aacute;logo Nacional de Ocupaciones se encuentran disponibles en el reverso de este formato y en la p&aacute;gina&nbsp;</span><a href="http://www.stps.gob.mx" style="text-decoration:none;"><u><span style="font-family:'Arial Narrow'; font-size:8pt; color:#0000ff;">www.stps.gob.mx</span></u></a><span style="font-family:'Arial Narrow'; font-size:8pt;">&nbsp;</span></p>
    <p style="margin-top:0pt; margin-left:28.35pt; margin-bottom:0pt; text-indent:-28.35pt;"><span style="font-family:'Arial Narrow'; font-size:5.33pt;"><sup>2/</sup></span><span style="font-family:'Arial Narrow'; font-size:8pt;">&nbsp;&nbsp;&nbsp;</span><span style="font-family:'Arial Narrow'; font-size:8pt;">Las &aacute;reas tem&aacute;ticas de los cursos se encuentran disponibles en el reverso de este formato y en la p&aacute;gina&nbsp;</span><a href="http://www.stps.gob.mx" style="text-decoration:none;"><u><span style="font-family:'Arial Narrow'; font-size:8pt; color:#0000ff;">www.stps.gob.mx</span></u></a><span style="font-family:'Arial Narrow'; font-size:8pt;">&nbsp;</span></p>
    <p style="margin-top:0pt; margin-left:28.35pt; margin-bottom:0pt; text-indent:-28.35pt; font-size:8pt;"><span style="font-family:'Arial Narrow'; font-size:5.33pt;"><sup>3/</sup></span><span style="font-family:'Arial Narrow';">&nbsp;&nbsp;&nbsp;</span><span style="font-family:'Arial Narrow';">Cursos impartidos por el &aacute;rea competente de la Secretaria del Trabajo y Previsi&oacute;n Social.</span></p>
    <p style="margin-top:0pt; margin-left:28.35pt; margin-bottom:0pt; text-indent:-28.35pt; font-size:8pt;"><span style="font-family:'Arial Narrow'; font-size:5.33pt;"><sup>4/</sup></span><span style="font-family:'Arial Narrow';">&nbsp;&nbsp;&nbsp;</span><span style="font-family:'Arial Narrow';">Para empresas con menos de 51 trabajadores. Para empresas con m&aacute;s de 50 trabajadores firmar&iacute;a el representante del patr&oacute;n ante la Comisi&oacute;n mixta de capacitaci&oacute;n, adiestramiento y productividad.</span></p>
    <p style="margin-top:0pt; margin-left:28.35pt; margin-bottom:0pt; text-indent:-28.35pt; font-size:8pt;"><span style="font-family:'Arial Narrow'; font-size:5.33pt;"><sup>5/</sup></span><span style="font-family:'Arial Narrow';">&nbsp;&nbsp;&nbsp;</span><span style="font-family:'Arial Narrow';">Solo para empresas con m&aacute;s de 50 trabajadores.</span></p>
    <p style="margin-top:0pt; margin-left:28.35pt; margin-bottom:0pt; text-indent:-28.35pt; font-size:8pt;"><span style="font-family:'Arial Narrow';">* Dato no obligatorio.</span></p>
    <div style="clear:both;">
        <p style="margin-top:0pt; margin-bottom:0pt; text-align:right; font-size:9pt;"><span style="font-family:'Arial Narrow';">DC-3</span><br><span style="font-family:'Arial Narrow';">ANVERSO</span></p>
    </div>
</div>
<p style="bottom: 10px; right: 10px; position: absolute;"><a href="https://wordtohtml.net/?utm_source=wth_free_doc_conversion_link&utm_medium=external" target="_blank" style="font-size:11px; color: #d0d0d0;">Convertido a HTML con WordToHTML.net</a><span style="font-size:11px; color: #d0d0d0;">&nbsp;|&nbsp;</span><a href="https://documentconverter.pro/?utm_source=wth_free_doc_conversion_link&utm_medium=external" target="_blank" style="font-size:11px; color: #d0d0d0;">Convertidor de Documentos para Windows</a></p>
`;

  return wrapper;
};

const generateCertificate = async (student) => {
  const el = createCertificateElement(student?.raw ?? student);
  document.body.appendChild(el);

  // Use html2canvas to render the DOM to canvas
  const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
  const imgData = canvas.toDataURL('image/png', 1.0);

  const pdf = new jsPDF('p', 'pt', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Fit image to page
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  const nameForFile = (student?.name || student?.raw?.name || 'estudiante').toLowerCase().replace(/\s+/g, '-');
  pdf.save(`certificado-${nameForFile}.pdf`);

  // cleanup
  setTimeout(() => {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }, 500);
};

onMounted(() => {
  impartCourseStore.fetchCourseDetails(route.params.id);
  setPageHeader('Detalles del curso', 'Aquí puedes ver los detalles del curso seleccionado');
});

onBeforeUnmount(() => {
  clearHeaderAppend();
});
</script>

<route lang="yaml">
meta:
  layout: auth
</route>