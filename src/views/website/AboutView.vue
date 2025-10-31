<script>

</script>


<template>
  <!-- Hero  ================================================= -->
  <section class="hero pt-[130px] pb-[60px] bg-mainBlack relative overflow-hidden">
    <div class="auto_container">
      <div class="hero_wrap">

        <div class="flex items-center justify-center gap-x-2 mb-[60px]">
          <RouterLink to="/" class="text-[17px] font-Gilroy text-[#6F736D]">
            Главная
          </RouterLink>

          <span class="block w-[18px]">
            <svg class="block w-full object-contain" width="7" height="14" viewBox="0 0 7 14" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.77279 7.39792L1.14779 13.0229C1.09553 13.0752 1.03349 13.1166 0.965204 13.1449C0.89692 13.1732 0.823734 13.1878 0.749825 13.1878C0.675915 13.1878 0.602729 13.1732 0.534445 13.1449C0.466162 13.1166 0.404117 13.0752 0.351855 13.0229C0.299593 12.9707 0.258137 12.9086 0.229853 12.8403C0.201569 12.772 0.187012 12.6989 0.187012 12.6249C0.187012 12.551 0.201569 12.4779 0.229853 12.4096C0.258137 12.3413 0.299593 12.2792 0.351855 12.227L5.57959 6.99995L0.351855 1.77292C0.246308 1.66737 0.187012 1.52421 0.187012 1.37495C0.187012 1.22568 0.246308 1.08253 0.351855 0.976978C0.457403 0.87143 0.600557 0.812134 0.749825 0.812134C0.899092 0.812134 1.04225 0.87143 1.14779 0.976978L6.77279 6.60198C6.82509 6.65422 6.86658 6.71626 6.89489 6.78454C6.9232 6.85283 6.93777 6.92603 6.93777 6.99995C6.93777 7.07387 6.9232 7.14706 6.89489 7.21535C6.86658 7.28364 6.82509 7.34567 6.77279 7.39792Z"
                fill="#6F736D" />
            </svg>
          </span>


          <h6 class="text-[17px] font-Gilroy text-mainWhite">
            О Банке
          </h6>
        </div>


        <h1 class="m-auto max-w-[660px] text-mainWhite mb-[10px] text-center text-5xl font-bold">
          Сенагат делает жизнь лучше
        </h1>

        <p class="text-[17px] font-Gilroy text-mainWhite/60 text-center">
          Обратитесь в удобный для вас офис
        </p>

        <span class="block mt-[125px] w-full max-w-[390px] mx-auto relative z-10">
          <img src="../../assets/images/senagat-big.png" class="block w-full h-full object-contain" alt="card">
        </span>
      </div>
    </div>

    <span class="card-bg-circle"></span>
  </section>

  <!-- Facts ================================================= -->
  <section class="py-[60px]">
    <div class="auto_container">
      <div class="wrap">
        <h2 class="text-[38px] font-bold mb-10 leading-9">
          Факты, которые говорят сами за себя
        </h2>

        <div class="grid grid-cols-12 gap-x-4">
          <div class="block col-span-4 bg-mainWhite rounded-[20px] p-8">
            <h4 class=" text-[28px] font-bold text-mainBlack mb-8">
              Банк года Туркменистана
            </h4>

            <span class="max-h-[220px] flex items-end justify-end">
              <img src="../../assets/images/fact.png" class="block max-h-full object-contain" alt="card">
            </span>
          </div>

          <div class="block col-span-4 bg-mainWhite rounded-[20px] p-8">
            <h4 class=" text-[28px] font-bold text-mainBlack mb-8">
              Банк года Туркменистана
            </h4>

            <span class="max-h-[220px] flex items-end justify-end">
              <img src="../../assets/images/fact.png" class="block max-h-full object-contain" alt="card">
            </span>
          </div>

          <div class="block col-span-4 bg-mainWhite rounded-[20px] p-8">
            <h4 class=" text-[28px] font-bold text-mainBlack mb-8">
              Банк года Туркменистана
            </h4>

            <span class="max-h-[220px] flex items-end justify-end">
              <img src="../../assets/images/fact.png" class="block max-h-full object-contain" alt="card">
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- History =============================================== -->
  <section class="py-[60px]">
    <div class="auto_container">
      <div class="wrap">
        <div class="flex gap-x-4">
          <div class="w-[calc(100%-306px)] bg-mainWhite rounded-[20px] overflow-hidden">
            <div class="flex items-center justify-center bg-[#2C702C] py-5">
              <h4 class="text-[38px] font-bold text-[#EEF2ED]">
                1989-2025
              </h4>
            </div>

            <p class="p-8 text-[17px] font-Gilroy leading-7">
              Основной целью создания банка было содействие развитию предпринимателей и частных предприятий,
              занимающихся коммерческой и промышленной деятельностью в Туркменистане. С того дня банк начал работать
              на собственном балансе, печати, пассивах, обязательствах, правах.20 октября 1989 года утвержден Устав
              Коммерческого банка «Сенагат».
            </p>
          </div>

          <div class="w-[290px] bg-mainWhite rounded-[20px] flex items-center justify-center">
            <img src="../../assets/images/senagat-big.png" class="w-[200px] block object-contain" alt="emblem">
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- App =================================================== -->
  <section class="pt-[180px] pb-[250px]">
    <div class="auto_container">
      <div class="wrap">

        <div class="block relative">
          <div class=" bg-mainBlack rounded-[20px] p-8 relative overflow-hidden ellipse">
            <h4 class="text-[28px] text-mainWhite font-bold mb-[10px] leading-8 z-10">
              Скачай приложение
            </h4>
            <p class="text-mainWhite/60 font-Gilroy text-[17px] leading-6 z-10 max-w-[330px]">
              Курс действует на текущее время. Точный курс будет определён на момент совершения операции
            </p>

            <div class="bg-circle"></div>

          </div>
          <span class="block w-[220px] absolute top-1/2 -translate-y-1/2 right-[20%] z-10">
            <img class="block w-full h-full object-contain" src="../../assets/images/mobile-app.png" alt="app-image">
          </span>
        </div>

      </div>
    </div>
  </section>

</template>

<style lang="scss" scoped>
.card-bg-circle {
  display: block;
  position: absolute;
  width: 560px;
  height: 560px;
  left: 50%;
  transform: translateX(-50%);
  bottom: -362px;
  background: #2C702C;
  filter: blur(137.15px);
  border-radius: 50%;
  z-index: 1;
}

.bg-circle {
  position: absolute;
  width: 425px;
  height: 425px;
  background: #2C702C;
  border-radius: 50%;
  filter: blur(137.15px);
  z-index: 1;
  right: 15%;
  top: 50%;
  transform: translateY(-50%);
}
</style>
