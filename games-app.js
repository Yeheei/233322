// === 新增：游戏 App 功能 (V2 - 包含小剧场逻辑) ===
document.getElementById('app-games').addEventListener('click', function(e) {
    // 定义游戏卡片的数据和SVG图标
    const games = [
        { name: '小剧场', icon: '<svg t="1769319040210" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1411" width="32" height="32"><path d="M336.426667 499.434667c155.093333-62.549333 357.034667 3.136 340.928-3.114667q40.96-148.586667 152.192-136.064-21.973333-225.216-210.709334-178.282667-121.450667-106.346667-220.949333-3.136-204.842667-20.330667-213.632 184.533334 124.373333-9.386667 152.170667 136.064z m0 0l493.12-103.210667c-29.546667-0.277333-56.938667 16.448-71.701334 43.797333-4.672 5.077333-8.618667 10.88-11.712 17.194667l-43.882666 109.482667q-229.738667-103.232-384.853334 3.114666l-36.565333-95.402666a89.6 89.6 0 0 0-24.874667-39.082667c-16.490667-20.608-40.490667-32.576-65.856-32.853333C144.768 399.786667 106.666667 438.4 106.688 486.933333c-0.832 28.949333 11.776 56.448 33.664 73.493334 9.728 8.597333 19.989333 16.426667 30.72 23.466666l65.856 164.202667c11.712 26.602667 49.749333 39.104 68.778667 46.933333l-24.874667 46.912c-9.28 17.28-3.712 39.317333 12.458667 49.237334 16.149333 9.92 36.778667 3.989333 46.08-13.269334l43.882666-79.765333h260.458667l43.904 79.765333c9.28 17.28 29.909333 23.210667 46.08 13.290667 16.149333-9.941333 21.717333-32 12.437333-49.28l-24.874666-43.776c29.952-6.101333 55.466667-26.965333 68.778666-56.298667l55.594667-159.509333a102.677333 102.677333 0 0 0 52.693333-39.104 94.613333 94.613333 0 0 0 19.008-56.32c-2.304-49.365333-40.085333-88.362667-86.336-89.130667L336.426667 499.434667z" p-id="1412" fill="#13227a"></path></svg>' },
        { name: '测谎仪', icon: '<svg t="1769319148603" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3017" width="32" height="32"><path d="M743.04 804.16a715.2 715.2 0 0 1-219.84 32A710.72 710.72 0 0 1 290.56 800H288a379.2 379.2 0 1 1 455.68 6.08m-73.6 78.4c-2.88 0-22.4 8-29.12 9.92a401.28 401.28 0 0 1-120.96 13.76 411.84 411.84 0 0 1-116.16-14.4c-9.92-2.88-29.12-9.92-38.08-13.12a48.96 48.96 0 0 1-4.48-6.72 814.4 814.4 0 0 0 162.56 16.32 870.72 870.72 0 0 0 148.16-14.4 16.96 16.96 0 0 0-3.52 6.72M519.36 65.92a432.64 432.64 0 0 0-224 802.56 32 32 0 0 1 12.8 18.88l2.24 4.8c11.84 21.12 21.12 32 35.52 36.48s28.48 10.24 42.88 14.72a463.68 463.68 0 0 0 130.88 16.64 444.8 444.8 0 0 0 136.96-16.32c8-2.56 27.84-9.92 29.76-10.24a74.24 74.24 0 0 0 34.24-32l2.24-3.84a71.68 71.68 0 0 1 21.44-29.76 432.64 432.64 0 0 0-224-802.24" fill="#13227a" p-id="3018"></path><path d="M506.24 373.12a118.08 118.08 0 0 1 0 235.84 118.08 118.08 0 0 1 0-235.84z m0 178.88a61.12 61.12 0 0 0 3.52-121.92h-3.52a61.12 61.12 0 1 0 0 121.92z m0-317.12a28.48 28.48 0 1 0-28.48-28.48 28.48 28.48 0 0 0 28.48 28.48" fill="#13227a" p-id="3019"></path></svg>' },
        { name: '情侣问答', icon: '<svg t="1769319222515" class="icon" viewBox="0 0 1134 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4003" width="32" height="32"><path d="M220.897507 1024v-145.728532H99.279778A99.279778 99.279778 0 0 1 0 780.055402V415.556787a99.634349 99.634349 0 0 1 99.279778-99.279779H248.199446v70.914128H99.279778a28.365651 28.365651 0 0 0-28.365651 28.365651V780.055402a28.365651 28.365651 0 0 0 28.365651 28.365651h192.531856v87.933518l138.99169-87.933518h179.412742v70.914127h-158.847645z" p-id="4004" fill="#13227a"></path><path d="M931.102493 910.537396L638.227147 726.160665H332.941828A120.554017 120.554017 0 0 1 212.742382 605.606648V120.554017A120.554017 120.554017 0 0 1 332.941828 0h681.484765A120.908587 120.908587 0 0 1 1134.626039 120.554017v485.052631a120.908587 120.908587 0 0 1-120.554017 120.554017h-82.969529zM332.941828 70.914127A49.639889 49.639889 0 0 0 283.65651 120.554017v485.052631a49.639889 49.639889 0 0 0 49.639889 49.639889h326.204986l200.686981 126.581718v-126.581718h154.238227a49.639889 49.639889 0 0 0 49.639889-49.639889V120.554017a49.639889 49.639889 0 0 0-49.639889-49.63989z" p-id="4005" fill="#13227a"></path><path d="M976.842105 497.462604h-70.914127v-15.955679l-54.603878-140.764543-54.958449 140.764543v15.955679h-70.914127v-29.074792l98.925207-254.581718h53.540167l98.925207 254.581718v29.074792zM531.855956 496.398892a141.828255 141.828255 0 1 1 141.828255-141.828255 141.828255 141.828255 0 0 1-141.828255 141.828255z m0-212.742382a70.914127 70.914127 0 1 0 70.914127 70.914127 70.914127 70.914127 0 0 0-70.914127-70.914127z" p-id="4006" fill="#13227a"></path><path d="M581.460388 455.091413l50.100831-50.171745 54.178393 54.142936-50.136288 50.171745z" p-id="4007" fill="#13227a"></path></svg>' },
        { name: '提问箱', icon: '<svg t="1769319385471" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5775" width="32" height="32"><path d="M958 283v-2c0-4.1-2-6.1-2-8.2l-59.1-135c-20.4-45-63.1-73.6-112-73.6H237.1c-48.9-2-91.6 26.6-112 71.6L66 270.7c-2 2-2 6.1-2 8.2v558.4C64 904.8 119 960 186.2 960h651.6C905 960 960 904.8 960 837.3V287.1c-2-2.1-2-4.1-2-4.1zM196.5 176.2c8.6-19.6 27.9-32.3 49.3-32.3h528.3c21.3 0 40.7 12.7 49.3 32.3l30.7 70H165.8l30.7-70z m682 649.9c0 29.9-24.1 54.1-53.9 54.1H199.3c-29.7 0-53.9-24.2-53.9-54.1V328h733.1v498.1z" fill="currentColor" p-id="5776"></path><path d="M465.5 713.2h81.3v76.7h-81.3zM580 608.3c-31 21.1-44.8 41.7-41.5 61.6v13.4h-66.4V665c-1.1-34.4 13.3-62.2 43.1-83.3 27.6-22.2 40.9-42.2 39.9-60-2.2-23.3-14.9-36.1-38.2-38.3-31 0-50.3 20.5-58 61.6l-74.7-16.6c13.3-75.5 61.4-112.2 144.3-110 68.6 3.3 105.6 34.4 111.1 93.4 2.3 35.4-17.6 67.6-59.6 96.5z" p-id="5777" fill="currentColor"></path></svg>' },
        { name: '塔罗', icon: '<svg t="1771178756660" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2000" width="32" height="32"><path d="M832 32H352a64.072 64.072 0 0 0-64 64v62h32V96a32.038 32.038 0 0 1 32-32h480a32.038 32.038 0 0 1 32 32v672a32.038 32.038 0 0 1-32 32h-96v32h96a64.072 64.072 0 0 0 64-64V96a64.072 64.072 0 0 0-64-64z" p-id="2001" fill="currentColor"></path><path d="M770.734 706.76A63.752 63.752 0 0 0 754 736h-18v32h32a16 16 0 0 0 16-16 32 32 0 0 1 32-32 16 16 0 0 0 16-16V160a16 16 0 0 0-16-16 32 32 0 0 1-32-32 16 16 0 0 0-16-16H416a16 16 0 0 0-16 16 32.036 32.036 0 0 1-19.562 29.49l12.47 29.468A64.142 64.142 0 0 0 430 128h324.01a64.164 64.164 0 0 0 46 46v516.02a63.838 63.838 0 0 0-29.276 16.74z" p-id="2002" fill="currentColor"></path><path d="M640 192H160a64.072 64.072 0 0 0-64 64v64h32v-64a32.038 32.038 0 0 1 32-32h480a32.038 32.038 0 0 1 32 32v672a32.038 32.038 0 0 1-32 32H160a32.038 32.038 0 0 1-32-32V352H96v576a64.072 64.072 0 0 0 64 64h480a64.072 64.072 0 0 0 64-64V256a64.072 64.072 0 0 0-64-64z" p-id="2003" fill="currentColor"></path><path d="M208 912a16 16 0 0 0 16 16h352a16 16 0 0 0 16-16 32.038 32.038 0 0 1 32-32 16 16 0 0 0 16-16V320a16 16 0 0 0-16-16 32.038 32.038 0 0 1-32-32 16 16 0 0 0-16-16H224a16 16 0 0 0-16 16 32.038 32.038 0 0 1-32 32 16 16 0 0 0-16 16v544a16 16 0 0 0 16 16 32.038 32.038 0 0 1 32 32z m-16-578.026A64.236 64.236 0 0 0 237.976 288h324.048A64.236 64.236 0 0 0 608 333.974v516.052A64.236 64.236 0 0 0 562.024 896H237.976A64.236 64.236 0 0 0 192 850.026z" p-id="2004" fill="currentColor"></path><path d="M224 352h32v32h-32zM224 496h32v32h-32zM304 384h32v32h-32zM544 384h32v32h-32zM224 752h32v32h-32zM320 800h32v32h-32zM560 752h32v32h-32zM464 832h32v32h-32z" p-id="2005" fill="currentColor"></path><path d="M234.94 591.18l70.082 23.362-46.89 81.478a16 16 0 0 0 21.848 21.848L359 672.4l25.292 130.65a16 16 0 0 0 31.416 0L441 672.4l79.02 45.476a16 16 0 0 0 21.848-21.848l-46.89-81.478 70.082-23.37a16 16 0 0 0 0-30.36l-70.082-23.362 46.89-81.478a16 16 0 0 0-21.848-21.848L441 479.6l-25.292-130.65a16 16 0 0 0-31.416 0l-21.682 112 31.416 6.084L400 436.186l13.844 71.512a16 16 0 0 0 23.688 10.826l46.982-27.038-27.036 46.98a16 16 0 0 0 8.8 23.16L509.4 576l-43.12 14.374a16 16 0 0 0-8.8 23.16l27.036 46.98-46.982-27.038a16 16 0 0 0-23.688 10.826L400 715.814l-13.844-71.512a16 16 0 0 0-23.688-10.826l-46.982 27.038 27.036-46.98a16 16 0 0 0-8.8-23.16L290.6 576l43.12-14.374a16 16 0 0 0 8.8-23.16l-27.036-46.98 46.982 27.038 15.96-27.734-98.446-56.658a16 16 0 0 0-21.848 21.848l46.89 81.478-70.082 23.362a16 16 0 0 0 0 30.36z" p-id="2006" fill="currentColor"></path><path d="M544 496h32v32h-32zM464 336h32v32h-32z" p-id="2007" fill="currentColor"></path></svg>' },
        { name: '东玄', icon: '<svg t="1771178593130" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8719" width="32" height="32"><path d="M713.03705 26.773987l284.25529 284.211072v401.963555L713.03705 997.248122H311.051386L26.70766 713.059159V310.985059L311.051386 26.773987h401.985664m11.054495-26.773987H299.930564L0 299.952673V724.091545l299.930564 299.908455h424.116763L1024.088436 724.091545V299.952673z m0 0" p-id="8720" fill="currentColor"></path><path d="M512.044218 260.333362a251.62242 251.62242 0 1 1-251.62242 251.62242A251.62242 251.62242 0 0 1 512.044218 260.333362m0-26.773987a277.158304 277.158304 0 1 0 108.334053 21.843682 277.887901 277.887901 0 0 0-108.334053-21.843682z m1.171776 530.61577z m0 0" p-id="8721" fill="currentColor"></path><path d="M472.535452 638.109681a38.646515 38.646515 0 1 0 19.323258-33.473011 38.646515 38.646515 0 0 0-19.323258 33.473011z m0 0" p-id="8722" fill="currentColor"></path><path d="M513.10545 259.913291h-0.972796a252.175145 252.175145 0 0 0 0 504.328181h0.22109a126.142845 126.142845 0 0 1-0.22109-252.28569h0.331635a126.021245 126.021245 0 0 0 0.641161-252.042491z m-1.171777 164.048709a38.646515 38.646515 0 1 1 38.75706-38.668624 38.646515 38.646515 0 0 1-38.75706 38.646515zM567.935746 94.051645h-111.362985a12.889541 12.889541 0 0 1-12.845323-12.845323V71.876328a12.889541 12.889541 0 0 1 12.845323-12.845324h111.362985a12.889541 12.889541 0 0 1 12.845323 12.845324v9.307885a12.823214 12.823214 0 0 1-12.845323 12.845323z m0 53.968046h-111.362985a12.889541 12.889541 0 0 1-12.845323-12.845324v-9.307885a12.889541 12.889541 0 0 1 12.845323-12.845323h111.362985a12.889541 12.889541 0 0 1 12.845323 12.845323v9.241558a12.823214 12.823214 0 0 1-12.845323 12.845324z m0 53.968045h-111.362985a12.889541 12.889541 0 0 1-12.845323-12.845323v-9.307885a12.889541 12.889541 0 0 1 12.845323-12.845323h111.362985a12.889541 12.889541 0 0 1 12.845323 12.845323v9.307885a12.823214 12.823214 0 0 1-12.845323 12.845323z m0 0M567.62622 856.966577h-111.47353a12.889541 12.889541 0 0 1-12.845323-12.845323v-9.307885a12.889541 12.889541 0 0 1 12.845323-12.845323h111.47353a12.889541 12.889541 0 0 1 12.845323 12.845323v9.307885a12.823214 12.823214 0 0 1-12.845323 12.845323z m0 54.078591h-111.47353a12.889541 12.889541 0 0 1-12.845323-12.845323v-9.307885a12.889541 12.889541 0 0 1 12.845323-12.845324h111.47353a12.889541 12.889541 0 0 1 12.845323 12.845324v9.307885a12.889541 12.889541 0 0 1-12.845323 12.845323z m0 53.968046h-111.47353a12.889541 12.889541 0 0 1-12.845323-12.845324v-9.307885a12.889541 12.889541 0 0 1 12.845323-12.845323h111.47353a12.889541 12.889541 0 0 1 12.845323 12.845323v9.307885a12.889541 12.889541 0 0 1-12.845323 12.845324z m0 0M94.117972 456.064254v111.47353a12.889541 12.889541 0 0 1-12.845323 12.845323h-9.307885a12.889541 12.889541 0 0 1-12.845324-12.845323v-111.47353a12.889541 12.889541 0 0 1 12.845324-12.845323h9.307885a12.889541 12.889541 0 0 1 12.845323 12.845323z m53.968046 0v111.47353a12.889541 12.889541 0 0 1-12.845324 12.845323h-9.307885a12.889541 12.889541 0 0 1-12.845323-12.845323v-111.47353a12.889541 12.889541 0 0 1 12.845323-12.845323h9.307885a12.889541 12.889541 0 0 1 12.845324 12.845323z m53.968045 0v111.47353a12.889541 12.889541 0 0 1-12.845323 12.845323h-9.307885a12.889541 12.889541 0 0 1-12.845323-12.845323v-111.47353a12.889541 12.889541 0 0 1 12.845323-12.845323h9.307885a12.889541 12.889541 0 0 1 12.845323 12.845323z m0 0M857.032904 456.506434v111.47353a12.889541 12.889541 0 0 1-12.845323 12.845323h-9.307885a12.889541 12.889541 0 0 1-12.845323-12.845323v-111.47353a12.889541 12.889541 0 0 1 12.845323-12.845323h9.307885a12.889541 12.889541 0 0 1 12.845323 12.845323z m53.968046 0v111.47353a12.889541 12.889541 0 0 1-12.845323 12.845323h-9.307885a12.889541 12.889541 0 0 1-12.845324-12.845323v-111.47353a12.889541 12.889541 0 0 1 12.845324-12.845323h9.307885a12.889541 12.889541 0 0 1 12.845323 12.845323z m53.968046 0v111.47353a12.889541 12.889541 0 0 1-12.845324 12.845323h-9.307885a12.889541 12.889541 0 0 1-12.845323-12.845323v-111.47353a12.889541 12.889541 0 0 1 12.845323-12.845323h9.307885a12.823214 12.823214 0 0 1 12.845324 12.845323z m0 0M256.022109 176.916141l-78.796442 78.818551a12.867432 12.867432 0 0 1-18.195699 0l-6.632697-6.632697a12.845323 12.845323 0 0 1 0-18.195699l78.796442-78.818551a12.867432 12.867432 0 0 1 18.195699 0l6.632697 6.632697a12.845323 12.845323 0 0 1 0 18.195699z m38.204335 38.226445l-78.81855 78.796442a12.845323 12.845323 0 0 1-18.1957 0l-6.632697-6.632698a12.867432 12.867432 0 0 1 0-18.195699l78.929096-78.730115a12.845323 12.845323 0 0 1 18.195699 0l6.632697 6.632698a12.867432 12.867432 0 0 1 0 18.195699z m38.1159 38.115899l-78.796442 78.796442a12.867432 12.867432 0 0 1-18.195699 0l-6.632697-6.632697a12.867432 12.867432 0 0 1 0-18.195699l78.818551-78.796442a12.845323 12.845323 0 0 1 18.195699 0l6.632697 6.632697a12.867432 12.867432 0 0 1 0 18.195699z m0 0M795.260385 716.685033l-78.752224 78.818551a12.845323 12.845323 0 0 1-18.195699 0l-6.632697-6.632697a12.867432 12.867432 0 0 1 0-18.195699l78.818551-78.796442a12.867432 12.867432 0 0 1 18.195699 0l6.632697 6.632697a12.867432 12.867432 0 0 1 0 18.195699z m38.226445 38.1159l-78.796442 78.796442a12.867432 12.867432 0 0 1-18.195699 0l-6.632697-6.632698a12.867432 12.867432 0 0 1 0-18.195699l78.796441-78.796442a12.867432 12.867432 0 0 1 18.195699 0l6.632698 6.632698a13.066413 13.066413 0 0 1 0 18.195699z m38.115899 38.226444l-78.818551 78.818551a12.867432 12.867432 0 0 1-18.195699 0l-6.632697-6.632697a12.845323 12.845323 0 0 1 0-18.195699l78.995423-78.708006a12.867432 12.867432 0 0 1 18.195699 0l6.632697 6.632697a12.867432 12.867432 0 0 1 0 18.195699z m0 0M177.048795 767.977891l78.796442 78.796442a12.867432 12.867432 0 0 1 0 18.195699l-6.632697 6.632697a12.867432 12.867432 0 0 1-18.195699 0l-78.796442-78.796442a12.867432 12.867432 0 0 1 0-18.195699l6.632697-6.632697a12.867432 12.867432 0 0 1 18.195699 0zM215.120477 729.839883l78.796442 78.796441a12.867432 12.867432 0 0 1 0 18.195699l-6.632698 6.632698a12.867432 12.867432 0 0 1-18.195699 0L190.314189 754.601952a12.867432 12.867432 0 0 1 0-18.195699l6.632698-6.632697a12.867432 12.867432 0 0 1 18.195699 0z m38.226444-38.226445l78.796442 78.796442a12.867432 12.867432 0 0 1 0 18.195699l-6.632697 6.632697a12.867432 12.867432 0 0 1-18.195699 0l-78.818551-78.796442a12.867432 12.867432 0 0 1 0-18.195699l6.632697-6.632697a13.066413 13.066413 0 0 1 18.195699 0z m0 0M716.773469 228.739615l78.818551 78.818551a12.867432 12.867432 0 0 1 0 18.195699l-6.632697 6.632697a12.867432 12.867432 0 0 1-18.195699 0l-78.796442-78.796442a12.867432 12.867432 0 0 1 0-18.195699l6.632697-6.632697a13.066413 13.066413 0 0 1 18.195699 0z m38.1159-38.1159l78.796442 78.818551a12.867432 12.867432 0 0 1 0 18.195699l-6.632698 6.632697a12.867432 12.867432 0 0 1-18.195699 0L730.171517 215.363676a12.867432 12.867432 0 0 1 0-18.195699l6.632698-6.632698a12.845323 12.845323 0 0 1 18.195699 0z m38.226444-38.115899l78.796442 78.796442a12.867432 12.867432 0 0 1 0 18.195699l-6.632697 6.632697a12.867432 12.867432 0 0 1-18.195699 0L768.176872 177.336212a12.867432 12.867432 0 0 1 0-18.195699l6.632697-6.632697a12.977977 12.977977 0 0 1 18.306244 0z m0 0" p-id="8723" fill="currentColor"></path></svg>' },
        { name: '直播', icon: '<svg t="1771178687894" class="icon" viewBox="0 0 1028 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13800" width="32" height="32"><path d="M844.8 691.2l68.266667 42.666667c46.933333 29.866667 102.4-4.266667 102.4-59.733334V366.933333c0-55.466667-59.733333-85.333333-102.4-59.733333l-68.266667 42.666667v81.066666l106.666667-64v307.2l-106.666667-64v81.066667z" fill="currentColor" p-id="13801"></path><path d="M610.133333 128H264.533333C98.133333 128 34.133333 187.733333 34.133333 337.066667v349.866666c0 102.4 59.733333 209.066667 234.666667 209.066667h345.6c162.133333 0 226.133333-55.466667 234.666667-192v-384C836.266667 183.466667 772.266667 128 610.133333 128z m166.4 576c0 46.933333-12.8 76.8-34.133333 93.866667-21.333333 17.066667-68.266667 29.866667-132.266667 29.866666H264.533333c-110.933333 0-166.4-46.933333-166.4-140.8V337.066667c0-55.466667 8.533333-89.6 29.866667-110.933334 21.333333-21.333333 68.266667-29.866667 132.266667-29.866666h345.6c64 0 106.666667 8.533333 132.266666 29.866666 21.333333 17.066667 29.866667 46.933333 34.133334 93.866667v384z" fill="currentColor" p-id="13802"></path><path d="M264.533333 422.4c-38.4 0-72.533333-34.133333-72.533333-72.533333s34.133333-72.533333 72.533333-72.533334c38.4 0 72.533333 34.133333 72.533334 72.533334s-34.133333 72.533333-72.533334 72.533333z" fill="currentColor" p-id="13803"></path></svg>' }
    ];

    const gameAppHTML = `
        <div class="game-app-grid">
            ${games.map(game => `
                <div class="game-card" data-gamename="${game.name}">
                    ${game.icon}
                    <span class="game-card-name">${game.name}</span>
                </div>
            `).join('')}
        </div>
    `;

    openModal('游戏', gameAppHTML, this);

    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const gameName = card.dataset.gamename;
            if (gameName === '小剧场') {
                // 打开小剧场专属界面，并渲染已有的小剧场
                renderLittleTheaterPage();
            } else if (gameName === '测谎仪') {
                renderPolygraphPage(card);
            } else {
                showCustomAlert(`你点击了【${gameName}】，该功能正在开发中...`);
            }
        });
    });
});

async function renderPolygraphPage(clickedElement) {
    const archiveData = JSON.parse(await localforage.getItem('archiveData') || '{}');
    const characters = Array.isArray(archiveData.characters) ? archiveData.characters : [];
    const userProfile = archiveData.user || {};
    const safeEscape = typeof escapeHTML === 'function'
        ? escapeHTML
        : (value) => String(value || '').replace(/[&<>"']/g, (match) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match]));

    const heartSvg = `
        <svg t="1772968545790" class="polygraph-heart-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3160" width="200" height="200">
            <path d="M616.608 315.158c52.56 0 95.128 42.568 95.128 95.004 0 78.43-64.848 129-140.912 197.688-16.076 14.504-32.646 29.832-49.198 46.406-17.818-17.82-35.614-34.196-52.81-49.672-74.468-67.042-137.198-117.238-137.198-194.422 0-52.436 42.542-95.004 95.004-95.004 47.502 0 71.252 23.752 95.004 71.254 23.752-47.502 47.504-71.254 94.982-71.254z" fill="#EF3E5C" p-id="3161"></path>
            <path d="M517.816 624.356c-74.468-67.042-137.198-117.238-137.198-194.422 0-52.436 42.542-95.004 95.004-95.004a126.8 126.8 0 0 1 10.24 0.414c-15.406-13.458-33.958-20.186-59.24-20.186-52.46 0-95.004 42.568-95.004 95.004 0 77.184 62.728 127.378 137.198 194.422 17.198 15.476 34.992 31.852 52.81 49.672a1004.826 1004.826 0 0 1 13.982-13.712 2032.63 2032.63 0 0 0-17.792-16.188z" fill="#E42A53" p-id="3162"></path>
            <path d="M720.454 708.842h-0.132a9.998 9.998 0 0 1-9.63-7.83l-28.414-127.86-24.828 74.484a10 10 0 0 1-9.486 6.838h-126.858c-5.524 0-10-4.476-10-10s4.476-10 10-10h119.65l33.964-101.896a9.972 9.972 0 0 1 10.002-6.824 9.998 9.998 0 0 1 9.246 7.816l27.056 121.752 44.094-176.374a10 10 0 0 1 19.404 0l34.352 137.402h46.558c5.524 0 10 4.476 10 10s-4.476 10-10 10h-54.368a10.004 10.004 0 0 1-9.702-7.574l-26.542-106.172-44.666 178.662a10 10 0 0 1-9.7 7.576z" fill="#EF3E5C" p-id="3163"></path>
            <path d="M321.672 708.842a10 10 0 0 1-9.7-7.574l-44.666-178.662-26.544 106.172a9.998 9.998 0 0 1-9.702 7.574H158.57a10 10 0 1 1 0-20h64.684l34.352-137.402a9.998 9.998 0 0 1 19.404 0l44.094 176.372 27.054-121.75a10 10 0 0 1 9.248-7.816c4.474-0.256 8.58 2.56 10.002 6.824l33.964 101.896h119.648c5.524 0 10 4.476 10 10s-4.476 10-10 10h-126.858a9.998 9.998 0 0 1-9.486-6.838l-24.828-74.484-28.412 127.86a10 10 0 0 1-9.63 7.83l-0.134-0.002z" fill="#EF3E5C" p-id="3164"></path>
        </svg>
    `;

    const charListHTML = characters.length > 0
        ? characters.map(char => `
            <button class="polygraph-char-option" data-char-id="${safeEscape(char.id)}" type="button">
                <div class="polygraph-char-avatar" style="background-image:url('${safeEscape(char.avatar || '')}')"></div>
                <span class="polygraph-char-name">${safeEscape(char.name || '未命名角色')}</span>
            </button>
        `).join('')
        : '<div class="polygraph-char-empty">暂无角色，请先在档案中创建角色</div>';

    const contentHTML = `
        <div id="polygraph-app" class="polygraph-app">
            <div id="polygraph-select-overlay" class="polygraph-select-overlay visible">
                <div class="polygraph-select-panel">
                    <div class="polygraph-select-header">
                        <div class="polygraph-select-title">选择角色开始测谎</div>
                        <button id="polygraph-worldbook-btn" class="polygraph-worldbook-btn" type="button" title="绑定世界书">
                            <svg t="1769871027121" class="polygraph-worldbook-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1410" width="24" height="24"><path d="M277.333333 1002.666667c-83.2 0-149.333333-66.133333-149.333333-149.333334V170.666667c0-83.2 66.133333-149.333333 149.333333-149.333334h576c23.466667 0 42.666667 19.2 42.666667 42.666667v896c0 23.466667-19.2 42.666667-42.666667 42.666667H277.333333z m0-213.333334c-36.266667 0-64 27.733333-64 64s27.733333 64 64 64h533.333334v-128H277.333333zM213.333333 170.666667v548.266666c19.2-10.666667 40.533333-14.933333 64-14.933333h533.333334V106.666667H277.333333c-36.266667 0-64 27.733333-64 64z" fill="#2c2c2c" p-id="1411"></path><path d="M362.666667 320h298.666666c23.466667 0 42.666667-19.2 42.666667-42.666667s-19.2-42.666667-42.666667-42.666666H362.666667c-23.466667 0-42.666667 19.2-42.666667 42.666666s19.2 42.666667 42.666667 42.666667M362.666667 469.333333h170.666666c23.466667 0 42.666667-19.2 42.666667-42.666666s-19.2-42.666667-42.666667-42.666667h-170.666666c-23.466667 0-42.666667 19.2-42.666667 42.666667s19.2 42.666667 42.666667 42.666666" fill="#2c2c2c" p-id="1412"></path></svg>
                        </button>
                    </div>
                    <div id="polygraph-char-list" class="polygraph-char-list">${charListHTML}</div>
                </div>
            </div>
            <section class="polygraph-portrait-area">
                <div class="polygraph-portrait-wrap">
                    <div id="polygraph-char-portrait" class="polygraph-portrait"></div>
                    <div id="polygraph-char-portrait-name" class="polygraph-portrait-name">未选择角色</div>
                </div>
                <div class="polygraph-heart-wrap">${heartSvg}</div>
                <div class="polygraph-portrait-wrap">
                    <div id="polygraph-user-portrait" class="polygraph-portrait"></div>
                    <div id="polygraph-user-portrait-name" class="polygraph-portrait-name">${safeEscape(userProfile.name || '你')}</div>
                </div>
            </section>
            <section id="polygraph-dialog-list" class="polygraph-dialog-list"></section>
            <section class="polygraph-input-area">
                <div id="polygraph-input-panel" class="polygraph-input-panel">
                    <input id="polygraph-question-input" class="polygraph-question-input" placeholder="输入你想问的问题..." />
                    <button id="polygraph-send-btn" class="polygraph-send-btn" type="button">发送</button>
                </div>
                <div id="polygraph-action-panel" class="polygraph-action-panel">
                    <button id="polygraph-followup-btn" class="polygraph-state-btn" type="button">追问</button>
                    <button id="polygraph-next-btn" class="polygraph-state-btn" type="button">下一题</button>
                </div>
            </section>
        </div>
    `;

    openModal('测谎仪', contentHTML, { clickedElement });

    const state = {
        mode: 'question',
        selectedChar: null,
        history: [],
        waiting: false,
        boundWorldBookItems: JSON.parse(await localforage.getItem('polygraphBoundWorldBookItems')) || []
    };

    const selectOverlay = document.getElementById('polygraph-select-overlay');
    const charPortrait = document.getElementById('polygraph-char-portrait');
    const charPortraitName = document.getElementById('polygraph-char-portrait-name');
    const userPortrait = document.getElementById('polygraph-user-portrait');
    const dialogList = document.getElementById('polygraph-dialog-list');
    const inputPanel = document.getElementById('polygraph-input-panel');
    const actionPanel = document.getElementById('polygraph-action-panel');
    const questionInput = document.getElementById('polygraph-question-input');
    const sendBtn = document.getElementById('polygraph-send-btn');
    const followupBtn = document.getElementById('polygraph-followup-btn');
    const nextBtn = document.getElementById('polygraph-next-btn');
    const userName = (userProfile.name || '你').trim() || '你';

    if (userProfile.avatar) {
        userPortrait.style.backgroundImage = `url('${userProfile.avatar}')`;
    } else {
        userPortrait.classList.add('is-empty');
    }

    const showInputPanel = (placeholder) => {
        inputPanel.classList.add('visible');
        actionPanel.classList.remove('visible');
        questionInput.value = '';
        questionInput.placeholder = placeholder || '输入你想问的问题...';
        questionInput.focus();
    };

    const showActionPanel = () => {
        inputPanel.classList.remove('visible');
        actionPanel.classList.add('visible');
    };

    const normalizeActionText = (text) => String(text || '')
        .trim()
        .replace(/^[（(]+|[）)]+$/g, '')
        .replace(/\s+/g, ' ');

    const normalizeSpeechText = (text) => String(text || '')
        .trim()
        .replace(/^[“"']+|[”"']+$/g, '');

    const combineReplyForHistory = (payload) => {
        const actionText = normalizeActionText(payload?.charAction || '');
        const speechText = normalizeSpeechText(payload?.charSpeech || '');
        return [actionText, speechText].filter(Boolean).join(' ');
    };

    const parseReplyPayload = (rawPayload, mode) => {
        const rawAction = normalizeActionText(rawPayload?.charAction || '');
        const rawSpeech = normalizeSpeechText(rawPayload?.charSpeech || '');
        let charAction = rawAction;
        let charSpeech = rawSpeech;

        if (!charAction && !charSpeech) {
            const oldReply = String(rawPayload?.charReply || '').trim();
            const quoteMatch = oldReply.match(/[“"]([^”"]+)[”"]/);
            if (quoteMatch) {
                charSpeech = normalizeSpeechText(quoteMatch[1]);
                charAction = normalizeActionText(oldReply.replace(quoteMatch[0], '').trim());
            } else {
                const lines = oldReply.split('\n').map(line => line.trim()).filter(Boolean);
                if (lines.length > 1) {
                    charAction = normalizeActionText(lines[0]);
                    charSpeech = normalizeSpeechText(lines.slice(1).join(' '));
                } else {
                    charSpeech = normalizeSpeechText(oldReply);
                }
            }
        }

        if (!charAction) charAction = 'TA停顿片刻，观察你的反应。';
        if (!charSpeech) charSpeech = '我还在想这个问题。';

        const output = {
            charAction,
            charSpeech
        };

        if (mode === 'question') {
            output.polygraphResult = rawPayload?.polygraphResult === '谎话' ? '谎话' : '真话';
            output.polygraphComment = String(rawPayload?.polygraphComment || '').trim();
        }

        return output;
    };

    const appendQuestionBlock = (question, isFollowup = false) => {
        const questionBlock = document.createElement('div');
        questionBlock.className = 'polygraph-block polygraph-question-block';
        questionBlock.innerHTML = `
            <div class="polygraph-block-title">${isFollowup ? '你的追问' : '你的问题'}</div>
            <div class="polygraph-block-content">${safeEscape(userName)}：${safeEscape(question)}</div>
        `;
        dialogList.appendChild(questionBlock);
        dialogList.scrollTop = dialogList.scrollHeight;
    };

    const appendCharReplyBlock = (payload) => {
        const actionText = normalizeActionText(payload.charAction);
        const speechText = normalizeSpeechText(payload.charSpeech);
        const answerBlock = document.createElement('div');
        answerBlock.className = 'polygraph-block polygraph-answer-block';
        answerBlock.innerHTML = `
            <div class="polygraph-block-title">TA的回答</div>
            <div class="polygraph-block-content">
                <div class="polygraph-char-action">${safeEscape(actionText)}</div>
                <div class="polygraph-char-speech">“${safeEscape(speechText)}”</div>
            </div>
        `;
        dialogList.appendChild(answerBlock);
    };

    const appendAnswerBlock = (answerPayload) => {
        appendCharReplyBlock(answerPayload);

        const result = answerPayload.polygraphResult;
        if (result) {
            const resultBlock = document.createElement('div');
            const isTruth = result === '真话';
            resultBlock.className = `polygraph-block polygraph-result-block ${isTruth ? 'truth' : 'lie'}`;
            resultBlock.innerHTML = `
                <div class="polygraph-block-title">测谎仪结果</div>
                <div class="polygraph-result-line">${safeEscape(result)}</div>
            `;
            dialogList.appendChild(resultBlock);
        }

        if (answerPayload.polygraphComment) {
            appendCharReplyBlock({
                charAction: 'TA看了看测谎仪的反馈，补充道：',
                charSpeech: normalizeSpeechText(answerPayload.polygraphComment)
            });
        }

        dialogList.scrollTop = dialogList.scrollHeight;
    };

    const appendRoundDivider = () => {
        if (!dialogList.lastElementChild || dialogList.lastElementChild.classList.contains('polygraph-round-divider')) return;
        const divider = document.createElement('div');
        divider.className = 'polygraph-round-divider';
        divider.textContent = '—— 本题结束 ——';
        dialogList.appendChild(divider);
        dialogList.scrollTop = dialogList.scrollHeight;
    };

    const callPolygraphApi = async (question, mode) => {
        const apiSettings = JSON.parse(await localforage.getItem('apiSettings') || '{}');
        if (!apiSettings.url || !apiSettings.key || !apiSettings.model) {
            throw new Error('API配置不完整，请先在设置中完成配置');
        }
        if (!state.selectedChar) {
            throw new Error('请先选择角色');
        }

        const chatHistory = state.history.slice(-8).map(item => `${item.role === 'user' ? userName : state.selectedChar.name}：${item.content}`).join('\n');
        
        let worldBookContent = '';
        if (state.boundWorldBookItems && state.boundWorldBookItems.length > 0) {
            const worldBookData = JSON.parse(await localforage.getItem('worldBookData')) || [];
            const allItems = worldBookData.flatMap(cat => cat.items || []);
            const selectedItems = allItems.filter(item => state.boundWorldBookItems.includes(item.id));
            if (selectedItems.length > 0) {
                worldBookContent = `\n【世界书信息】\n${selectedItems.map(item => `- ${item.title}: ${item.content}`).join('\n')}\n`;
            }
        }
        
        let userPrompt = '';

        if (mode === 'question') {
            userPrompt = `
你将进行角色回复与测谎判断，必须严格遵循人设，不得 OOC。
【char 人设】${state.selectedChar.persona || '未填写'}
【user 人设】${userProfile.persona || '未填写'}${worldBookContent}
【近期对话】${chatHistory || '无'}
【当前问题】${question}

要求：
1. 动作描写使用第三人称“TA”，不得使用括号。
2. 说话内容使用第一人称“我”，并把user称为“你”。
3. 判断Char的回答更接近真话还是谎话，只能输出“真话”或“谎话”。
4. 在测谎结果出来后，可选择是否让Char对测谎结果补充一句反应；不补充则返回空字符串。
5. 仅返回JSON，格式如下：
{"charAction":"...","charSpeech":"...","polygraphResult":"真话","polygraphComment":""}
`;
        } else {
            userPrompt = `
你正在进行测谎仪中的追问阶段，只需以char身份继续对话，不做真话谎话判断，必须严格遵循人设，不得OOC。
【char人设】${state.selectedChar.persona || '未填写'}
【user 人设】${userProfile.persona || '未填写'}${worldBookContent}
【近期对话】${chatHistory || '无'}
【当前追问】${question}
要求：
1. 动作描写使用第三人称“TA”，不得使用括号。
2. 说话内容使用第一人称“我”，并把user称为“你”。
3. 仅返回JSON，格式如下：
{"charAction":"...","charSpeech":"..."}
`;
        }

        const response = await fetch(new URL('/v1/chat/completions', apiSettings.url).href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiSettings.key}`
            },
            body: JSON.stringify({
                model: apiSettings.model,
                messages: [{ role: 'user', content: userPrompt }],
                temperature: apiSettings.temp || 0.8,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`API请求失败，状态码：${response.status}`);
        }

        const result = await response.json();
        const content = result?.choices?.[0]?.message?.content?.trim();
        if (!content) {
            throw new Error('AI返回内容为空');
        }

        let parsed = {};
        const normalized = content.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
        try {
            parsed = JSON.parse(normalized);
        } catch (error) {
            parsed = { charReply: normalized };
        }
        if (mode === 'question' && !parsed.polygraphResult) {
            parsed.polygraphResult = /谎/.test(normalized) ? '谎话' : '真话';
        }

        return parseReplyPayload(parsed, mode);
    };

    const handleSend = async () => {
        const question = questionInput.value.trim();
        if (!question || state.waiting) return;
        if (!state.selectedChar) {
            showCustomAlert('请先选择一个角色再开始提问');
            return;
        }

        state.waiting = true;
        sendBtn.disabled = true;
        sendBtn.textContent = '回复中...';

        appendQuestionBlock(question, state.mode === 'followup');
        state.history.push({ role: 'user', content: question });
        questionInput.value = '';

        try {
            if (state.mode === 'question') {
                const result = await callPolygraphApi(question, 'question');
                appendAnswerBlock(result);
                state.history.push({ role: 'assistant', content: combineReplyForHistory(result) });
                if (result.polygraphComment) {
                    state.history.push({ role: 'assistant', content: normalizeSpeechText(result.polygraphComment) });
                }
            } else {
                const result = await callPolygraphApi(question, 'followup');
                appendCharReplyBlock(result);
                dialogList.scrollTop = dialogList.scrollHeight;
                state.history.push({ role: 'assistant', content: combineReplyForHistory(result) });
            }
            showActionPanel();
        } catch (error) {
            showCustomAlert(error.message || '发送失败，请稍后重试');
        } finally {
            state.waiting = false;
            sendBtn.disabled = false;
            sendBtn.textContent = '发送';
        }
    };

    document.querySelectorAll('.polygraph-char-option').forEach(option => {
        option.addEventListener('click', () => {
            const charId = option.dataset.charId;
            const selectedChar = characters.find(char => String(char.id) === String(charId));
            if (!selectedChar) return;

            state.selectedChar = selectedChar;
            charPortraitName.textContent = selectedChar.name || '未命名角色';
            if (selectedChar.avatar) {
                charPortrait.style.backgroundImage = `url('${selectedChar.avatar}')`;
                charPortrait.classList.remove('is-empty');
            } else {
                charPortrait.style.backgroundImage = '';
                charPortrait.classList.add('is-empty');
            }
            selectOverlay.classList.remove('visible');
            showInputPanel('输入你想问的问题...');
        });
    });

    sendBtn.addEventListener('click', handleSend);
    questionInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSend();
        }
    });

    followupBtn.addEventListener('click', () => {
        state.mode = 'followup';
        showInputPanel('继续追问当前话题...');
    });

    nextBtn.addEventListener('click', () => {
        appendRoundDivider();
        state.mode = 'question';
        showInputPanel('输入下一题...');
    });

    const worldbookBtn = document.getElementById('polygraph-worldbook-btn');
    if (worldbookBtn) {
        worldbookBtn.addEventListener('click', async () => {
            const worldBookData = JSON.parse(await localforage.getItem('worldBookData')) || [];
            const allItems = worldBookData.flatMap(cat => cat.items || []);
            
            if (allItems.length === 0) {
                showCustomAlert('世界书为空，请先在预设管理中添加世界书内容');
                return;
            }

            const worldbookModalHTML = `
                <div class="polygraph-worldbook-modal">
                    <div class="polygraph-worldbook-content">
                        <div class="polygraph-worldbook-list">
                            ${worldBookData.map(category => `
                                <div class="polygraph-worldbook-category">
                                    <div class="polygraph-worldbook-category-header">
                                        <input type="checkbox" class="polygraph-wb-group-checkbox" data-category-id="${category.id}">
                                        <span class="polygraph-worldbook-category-name">${category.name}</span>
                                    </div>
                                    <div class="polygraph-worldbook-items collapsed">
                                        ${category.items && category.items.length > 0 ? category.items.map(item => `
                                            <label class="polygraph-worldbook-item">
                                                <input type="checkbox" class="polygraph-wb-item-checkbox" value="${item.id}" data-category-id="${category.id}" ${state.boundWorldBookItems.includes(item.id) ? 'checked' : ''}>
                                                <span class="polygraph-worldbook-item-title">${item.title}</span>
                                            </label>
                                        `).join('') : '<div class="polygraph-worldbook-empty">此分类下无条目</div>'}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="polygraph-worldbook-actions">
                            <button id="polygraph-wb-cancel-btn" class="polygraph-wb-btn secondary">取消</button>
                            <button id="polygraph-wb-confirm-btn" class="polygraph-wb-btn">确定</button>
                        </div>
                    </div>
                </div>
            `;

            const modalContainer = document.createElement('div');
            modalContainer.className = 'polygraph-worldbook-overlay';
            modalContainer.innerHTML = worldbookModalHTML;
            document.body.appendChild(modalContainer);

            setTimeout(() => modalContainer.classList.add('visible'), 10);

            const groupCheckboxes = modalContainer.querySelectorAll('.polygraph-wb-group-checkbox');
            const itemCheckboxes = modalContainer.querySelectorAll('.polygraph-wb-item-checkbox');
            const categoryHeaders = modalContainer.querySelectorAll('.polygraph-worldbook-category-header');

            groupCheckboxes.forEach(groupCheckbox => {
                const categoryId = groupCheckbox.dataset.categoryId;
                const categoryItems = Array.from(itemCheckboxes).filter(cb => cb.dataset.categoryId === categoryId);
                if (categoryItems.length > 0) {
                    groupCheckbox.checked = categoryItems.every(item => item.checked);
                    groupCheckbox.indeterminate = false;
                } else {
                    groupCheckbox.disabled = true;
                }
            });

            categoryHeaders.forEach(header => {
                header.addEventListener('click', (e) => {
                    if (e.target.classList.contains('polygraph-wb-group-checkbox')) {
                        return;
                    }
                    const category = header.closest('.polygraph-worldbook-category');
                    const itemsContainer = category.querySelector('.polygraph-worldbook-items');
                    
                    itemsContainer.classList.toggle('collapsed');
                });
            });

            modalContainer.addEventListener('change', (e) => {
                const target = e.target;
                if (!target.classList.contains('polygraph-wb-group-checkbox') && 
                    !target.classList.contains('polygraph-wb-item-checkbox')) return;

                if (target.classList.contains('polygraph-wb-group-checkbox')) {
                    const categoryId = target.dataset.categoryId;
                    const categoryItems = Array.from(itemCheckboxes).filter(cb => cb.dataset.categoryId === categoryId);
                    const isChecked = target.checked;
                    categoryItems.forEach(item => {
                        item.checked = isChecked;
                    });
                } else if (target.classList.contains('polygraph-wb-item-checkbox')) {
                    const categoryId = target.dataset.categoryId;
                    const groupCheckbox = modalContainer.querySelector(`.polygraph-wb-group-checkbox[data-category-id="${categoryId}"]`);
                    if (groupCheckbox) {
                        const categoryItems = Array.from(itemCheckboxes).filter(cb => cb.dataset.categoryId === categoryId);
                        const allChecked = categoryItems.every(item => item.checked);
                        const someChecked = categoryItems.some(item => item.checked);
                        
                        groupCheckbox.checked = allChecked;
                        groupCheckbox.indeterminate = !allChecked && someChecked;
                    }
                }
            });

            document.getElementById('polygraph-wb-cancel-btn')?.addEventListener('click', () => {
                modalContainer.classList.remove('visible');
                setTimeout(() => modalContainer.remove(), 300);
            });

            document.getElementById('polygraph-wb-confirm-btn')?.addEventListener('click', async () => {
                const selectedItems = Array.from(itemCheckboxes)
                    .filter(cb => cb.checked)
                    .map(cb => cb.value);
                
                state.boundWorldBookItems = selectedItems;
                
                await localforage.setItem('polygraphBoundWorldBookItems', selectedItems);
                
                const count = selectedItems.length;
                worldbookBtn.setAttribute('title', `已绑定 ${count} 个世界书条目`);
                
                modalContainer.classList.remove('visible');
                setTimeout(() => modalContainer.remove(), 300);
                
                showGlobalToast(`已绑定 ${count} 个世界书条目`, { type: 'success' });
            });

            modalContainer.addEventListener('click', (e) => {
                if (e.target === modalContainer) {
                    modalContainer.classList.remove('visible');
                    setTimeout(() => modalContainer.remove(), 300);
                }
            });
        });
    }

    showInputPanel('请先在上方选择角色...');
    inputPanel.classList.remove('visible');
    actionPanel.classList.remove('visible');
}

async function renderLittleTheaterPage() {

    const theaters = JSON.parse(await localforage.getItem('littleTheaters') || '[]');
    let theaterListHTML = '';
    
    if (theaters.length === 0) {
        theaterListHTML = `<span class="empty-text" style="padding: 40px 0;">这里将显示已创建的小剧场列表...</span>`;
    } else {
        const cardsHTML = theaters.map((theater, index) => `
            <div class="little-theater-card" data-theater-index="${index}">
                <div class="little-theater-title">${escapeHTML(theater.title)}</div>
                <div class="little-theater-actors">
                    ${theater.actors.map(actor => `
                        <div class="little-theater-actor-avatar" style="background-image: url('${actor.avatar}')"></div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        theaterListHTML = `<div id="little-theater-list">${cardsHTML}</div>`;
    }

    openModal('小剧场', theaterListHTML);
    document.getElementById('little-theater-fab').classList.add('visible');

    const contextMenuOverlay = document.getElementById('little-theater-context-menu-overlay');
    const contextMenu = document.getElementById('little-theater-context-menu');
    let longPressTimer = null;
    let isLongPress = false;
    let currentTheaterIndex = null;

    const sanitizeTheaterFileName = (name) => {
        return String(name || '无题小剧场')
            .replace(/[\\/:*?"<>|]/g, '_')
            .replace(/\s+/g, ' ')
            .trim() || '无题小剧场';
    };

    const extractTheaterTitleFromHtml = (htmlContent, fallbackTitle) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const titleElement = tempDiv.querySelector('.theater-title');
        return (titleElement && titleElement.textContent.trim()) || fallbackTitle || '无题小剧场';
    };

    const buildTheaterPreviewDocument = (htmlContent) => {
        const safeHtml = String(htmlContent || '').replace(/<\/script/gi, '<\\/script');
        return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
html, body { margin: 0; padding: 0; min-height: 100%; overflow-x: hidden; background: #ffffff; }
body { color: #1f2937; font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; }
* { box-sizing: border-box; max-width: 100%; }
</style>
</head>
<body>
${safeHtml}
</body>
</html>`;
    };

    const renderTheaterPreview = (panelElement, htmlContent) => {
        if (!panelElement) return;
        const previewFrame = document.createElement('iframe');
        previewFrame.className = 'little-theater-preview-frame';
        previewFrame.setAttribute('sandbox', 'allow-scripts');
        previewFrame.setAttribute('loading', 'lazy');
        previewFrame.setAttribute('scrolling', 'yes');
        previewFrame.srcdoc = buildTheaterPreviewDocument(htmlContent);
        panelElement.innerHTML = '';
        panelElement.appendChild(previewFrame);
    };

    const openTheaterDetailModal = (index, clickedElement) => {
        const theater = theaters[index];
        if (!theater) return;

        const container = document.createElement('div');
        container.className = 'little-theater-detail-view';
        container.innerHTML = `<div class="little-theater-frost-panel"></div>`;

        openModal(theater.title, container.outerHTML, {
            clickedElement: clickedElement || null,
            onClose: renderLittleTheaterPage,
            onOpen: () => {
                const modalHeader = document.getElementById('modal-header');
                const modalBody = document.getElementById('modal-body');
                if (!modalHeader || !modalBody) return;
                renderTheaterPreview(modalBody.querySelector('.little-theater-frost-panel'), theater.htmlContent);

                const headerControlsHTML = `
                    <div id="modal-header-controls">
                        <div class="little-theater-header-menu-wrap">
                            <button id="little-theater-edit-btn" class="little-theater-header-icon-btn" title="小剧场操作">
                                <svg viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                            </button>
                            <div id="little-theater-edit-menu">
                                <button class="little-theater-edit-menu-item" data-action="edit">编辑</button>
                                <button class="little-theater-edit-menu-item" data-action="export">导出</button>
                                <button class="little-theater-edit-menu-item danger" data-action="delete">删除</button>
                            </div>
                        </div>
                    </div>
                `;
                modalHeader.insertAdjacentHTML('beforeend', headerControlsHTML);

                const editBtn = document.getElementById('little-theater-edit-btn');
                const editMenu = document.getElementById('little-theater-edit-menu');
                if (!editBtn || !editMenu) return;

                const closeMenu = () => editMenu.classList.remove('visible');

                editBtn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    editMenu.classList.toggle('visible');
                });

                document.getElementById('modal-close-btn')?.addEventListener('click', closeMenu);
                modalBody.addEventListener('click', closeMenu);

                editMenu.addEventListener('click', async (event) => {
                    const action = event.target.dataset.action;
                    if (!action) return;
                    closeMenu();

                    if (action === 'edit') {
                        const editorOverlay = document.createElement('div');
                        editorOverlay.className = 'little-theater-html-editor-overlay';
                        editorOverlay.innerHTML = `
                            <div class="little-theater-html-editor">
                                <h4>编辑 HTML</h4>
                                <textarea id="little-theater-html-editor-textarea"></textarea>
                                <div class="little-theater-html-editor-actions">
                                    <button class="modal-button secondary" id="cancel-little-theater-html-edit">取消</button>
                                    <button class="modal-button" id="save-little-theater-html-edit">保存并渲染</button>
                                </div>
                            </div>
                        `;
                        modalBody.appendChild(editorOverlay);

                        const textarea = document.getElementById('little-theater-html-editor-textarea');
                        const closeEditor = () => editorOverlay.remove();
                        textarea.value = theater.htmlContent || '';

                        editorOverlay.addEventListener('click', (e) => {
                            if (e.target === editorOverlay) closeEditor();
                        });
                        document.getElementById('cancel-little-theater-html-edit')?.addEventListener('click', closeEditor);
                        document.getElementById('save-little-theater-html-edit')?.addEventListener('click', async () => {
                            const newHtmlContent = textarea.value.trim();
                            if (!newHtmlContent) {
                                showCustomAlert('HTML 内容不能为空。');
                                return;
                            }

                            const updatedTitle = extractTheaterTitleFromHtml(newHtmlContent, theater.title);
                            theater.htmlContent = newHtmlContent;
                            theater.title = updatedTitle;
                            await localforage.setItem('littleTheaters', JSON.stringify(theaters));

                            const panel = modalBody.querySelector('.little-theater-frost-panel');
                            renderTheaterPreview(panel, newHtmlContent);
                            document.getElementById('modal-title').textContent = updatedTitle;
                            showGlobalToast('小剧场已更新', { type: 'success' });
                            closeEditor();
                        });
                    }

                    if (action === 'export') {
                        const fileName = `${sanitizeTheaterFileName(theater.title)}.html`;
                        const fileBlob = new Blob([theater.htmlContent || ''], { type: 'text/html;charset=utf-8' });
                        const fileURL = URL.createObjectURL(fileBlob);
                        const exportLink = document.createElement('a');
                        exportLink.href = fileURL;
                        exportLink.download = fileName;
                        document.body.appendChild(exportLink);
                        exportLink.click();
                        exportLink.remove();
                        URL.revokeObjectURL(fileURL);
                        showGlobalToast('导出成功', { type: 'success' });
                    }

                    if (action === 'delete') {
                        showCustomConfirm(`确定要删除小剧场 "${theater.title}" 吗？`, async () => {
                            theaters.splice(index, 1);
                            await localforage.setItem('littleTheaters', JSON.stringify(theaters));
                            closeModal();
                            showGlobalToast('删除成功', { type: 'success' });
                        });
                    }
                });
            }
        });

        document.getElementById('little-theater-fab').classList.remove('visible');
    };

    function showContextMenu(event, index) {
        currentTheaterIndex = index;
        
        let x, y;
        if (event.touches) {
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        } else {
            x = event.clientX;
            y = event.clientY;
        }

        const menuWidth = contextMenu.offsetWidth;
        const menuHeight = contextMenu.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (x + menuWidth > windowWidth - 10) x = windowWidth - menuWidth - 10;
        if (y + menuHeight > windowHeight - 10) y = windowHeight - menuHeight - 10;
        
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenuOverlay.classList.add('visible');
    }

    function hideContextMenu() {
        contextMenuOverlay.classList.remove('visible');
        currentTheaterIndex = null;
    }

    document.querySelectorAll('.little-theater-card').forEach(card => {
        const theaterIndex = card.dataset.theaterIndex;

        card.addEventListener('click', () => {
            if (isLongPress) return;
            openTheaterDetailModal(Number(theaterIndex), card);
        });

        const startPress = (e) => {
            isLongPress = false;
            longPressTimer = setTimeout(() => {
                isLongPress = true;
                if (e.type === 'touchstart') {
                    e.preventDefault();
                }
                showContextMenu(e, theaterIndex);
            }, 500);
        };

        const endPress = () => {
            clearTimeout(longPressTimer);
        };
        
        card.addEventListener('mousedown', startPress);
        card.addEventListener('mouseup', endPress);
        card.addEventListener('mouseleave', endPress);
        card.addEventListener('touchstart', startPress, { passive: false });
        card.addEventListener('touchend', endPress);
        card.addEventListener('touchmove', endPress, { passive: true });
    });

    contextMenuOverlay.onclick = (e) => {
        if (e.target === contextMenuOverlay) {
            hideContextMenu();
        }
    };

    contextMenu.onclick = async (e) => {
        const action = e.target.dataset.action;
        if (action === 'delete') {
            if (currentTheaterIndex !== null) {
                showCustomConfirm(`确定要删除小剧场 "${theaters[currentTheaterIndex].title}" 吗？`, async () => {
                    theaters.splice(currentTheaterIndex, 1);
                    await localforage.setItem('littleTheaters', JSON.stringify(theaters));
                    renderLittleTheaterPage(); // 重新渲染列表
                    showGlobalToast('删除成功', { type: 'success' });
                });
            }
        }
        hideContextMenu();
    };
    document.getElementById('little-theater-fab').onclick = openCreateTheaterPopup;
}
async function openCreateTheaterPopup() {
    const overlay = document.getElementById('create-theater-overlay');
    
    // 动态加载角色列表
    const archiveData = JSON.parse(await localforage.getItem('archiveData') || '{}');
    const characters = archiveData.characters || [];
    const charListContainer = document.getElementById('theater-character-list');
    
    if (characters.length > 0) {
        charListContainer.innerHTML = characters.map(char => `
            <div class="theater-character-item" data-char-id="${char.id}">
                <div class="theater-char-avatar" style="background-image: url('${char.avatar}');"></div>
                <span class="theater-char-name">${escapeHTML(char.name)}</span>
                <input type="checkbox" class="theater-char-checkbox" value="${char.id}">
            </div>
        `).join('');
    } else {
        charListContainer.innerHTML = '<span class="empty-text" style="padding: 30px 0; text-align: center;">暂无可用角色</span>';
    }

// --- 新的文风预设渲染逻辑 ---
const styleListContainer = document.getElementById('theater-writing-style-presets-list');

if (!styleListContainer) {
    console.error('找不到文风预设列表容器 #theater-writing-style-presets-list');
    return;
}

// 从全局加载文风数据
const writingStyleData = await window.loadWritingStyleData();

// 渲染可展开的预设列表
const renderExpandableStylePresets = () => {
    styleListContainer.innerHTML = '';
    if (writingStyleData.length === 0) {
        styleListContainer.innerHTML = '<span class="empty-text" style="font-size: 12px; opacity: 0.7;">请先在"预设管理-文风"中添加预设</span>';
        return;
    }

    writingStyleData.forEach(category => {
        const detailsEl = document.createElement('details');
        
        const summaryEl = document.createElement('summary');
        summaryEl.innerHTML = `
            <input type="checkbox" class="group-checkbox" data-group-id="${category.id}">
            <span>${escapeHTML(category.name)}</span>
            <svg class="summary-arrow" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>
        `;
        
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'style-items-container';
        
        if (category.items && category.items.length > 0) {
            category.items.forEach(item => {
                const itemLabel = document.createElement('label');
                itemLabel.className = 'preset-checkbox-item';
                itemLabel.innerHTML = `
                    <input type="checkbox" class="item-checkbox" value="${item.id}" data-group-id="${category.id}">
                    <span>${escapeHTML(item.title)}</span>
                `;
                itemsContainer.appendChild(itemLabel);
            });
        } else {
            itemsContainer.innerHTML = '<span class="empty-text" style="font-size: 12px; opacity: 0.7;">该分组下暂无内容</span>';
        }

        detailsEl.appendChild(summaryEl);
        detailsEl.appendChild(itemsContainer);
        styleListContainer.appendChild(detailsEl);
    });
};

renderExpandableStylePresets();

// 为列表添加事件委托
styleListContainer.addEventListener('change', (e) => {
    const target = e.target;
    if (target.type !== 'checkbox') return;

    if (target.classList.contains('group-checkbox')) {
        // 点击分组checkbox，同步所有子项
        const groupId = target.dataset.groupId;
        const items = styleListContainer.querySelectorAll(`.item-checkbox[data-group-id="${groupId}"]`);
        items.forEach(item => item.checked = target.checked);
    } else if (target.classList.contains('item-checkbox')) {
        // 点击子项checkbox，检查是否需要更新父级
        const groupId = target.dataset.groupId;
        const groupCheckbox = styleListContainer.querySelector(`.group-checkbox[data-group-id="${groupId}"]`);
        const allItems = styleListContainer.querySelectorAll(`.item-checkbox[data-group-id="${groupId}"]`);
        const allChecked = Array.from(allItems).every(item => item.checked);
        groupCheckbox.checked = allChecked;
    }
});

    overlay.classList.add('visible');

    // 为弹窗内的关闭和确认按钮绑定事件
    document.getElementById('cancel-create-theater').onclick = () => overlay.classList.remove('visible');
    
    // 为了防止多次绑定，先移除之前的事件监听器
    const confirmBtn = document.getElementById('confirm-create-theater');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    newConfirmBtn.addEventListener('click', generateLittleTheater);

    // 为每个角色项（除了 checkbox 之外的区域）添加点击事件，以触发 checkbox 的选中/取消
    document.querySelectorAll('.theater-character-item').forEach(item => {
        item.addEventListener('click', e => {
            // 确保点击的不是 checkbox 本身，避免双重触发
            if (e.target.type !== 'checkbox') {
                const checkbox = item.querySelector('.theater-char-checkbox');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
            }
        });
    });
}

async function generateLittleTheater() {
    const theme = document.getElementById('theater-theme-textarea').value.trim();
    const selectedCheckboxes = document.querySelectorAll('.theater-char-checkbox:checked');
    const confirmBtn = document.getElementById('confirm-create-theater');

    if (!theme) {
        showCustomAlert('请输入小剧场主题。');
        return;
    }
    if (selectedCheckboxes.length === 0) {
        showCustomAlert('请至少选择一个角色。');
        return;
    }
    
    const originalBtnText = confirmBtn.textContent;
    confirmBtn.textContent = '生成中...';
    confirmBtn.disabled = true;

    try {
        // 1. 获取API设置
        const apiSettings = JSON.parse(await localforage.getItem('apiSettings') || '{}');
        if (!apiSettings.url || !apiSettings.key || !apiSettings.model) {
            throw new Error('API配置不完整，请先在设置中配置。');
        }

        // 2. 整理角色人设
        const archiveData = JSON.parse(await localforage.getItem('archiveData')) || { characters: [] };
        let actorsInfo = [];
        let actorsPersonaPrompt = '';

        for (const checkbox of selectedCheckboxes) {
            const charId = checkbox.value;
            const character = archiveData.characters.find(c => c.id === charId);
            if (character) {
                actorsInfo.push({ id: character.id, name: character.name, avatar: character.avatar });
                actorsPersonaPrompt += `\n- 角色：${character.name}\n- 人设：${character.persona}\n`;
            }
        }

    // 4. 构建文风提示词
    let writingStylePrompt = '';
    const selectedStyleContents = [];
    const checkedItems = document.querySelectorAll('#theater-writing-style-presets-list .item-checkbox:checked');
    
    // 重新从全局加载一次最新的文风数据以确保数据同步
    const allWritingStyles = await window.loadWritingStyleData(); 

    checkedItems.forEach(checkbox => {
        const itemId = checkbox.value;
        // 遍历所有分组和条目以找到匹配项
        for (const category of allWritingStyles) {
            const foundItem = category.items.find(item => item.id === itemId);
            if (foundItem) {
                selectedStyleContents.push(foundItem.content);
                break; // 找到后跳出内层循环
            }
        }
    });

    if (selectedStyleContents.length > 0) {
        writingStylePrompt = `\n- 补充文风：\n${selectedStyleContents.join('\n\n')}\n`;
    }

        
        // 5. 构建核心提示词
        const littleTheaterPrompt = `你是一名专业的、富有创意的剧本杀（LARP）游戏主持人（GM）。你的任务是基于给定的主题和角色人设，创作一个引人入胜的"小剧场"片段。

【核心要求】
你必须使用HTML+CSS+JavaScript的交互界面模块来美化和排版输出内容，严格禁止使用纯文字。你的目标是让输出具有视觉吸引力、易于阅读，并能增强叙事氛围。

【格式化规则细节】
1.  **动态标题**：必须为小剧场生成一个概括内容的动态短语标题，并将其放入HTML中一个带有 \`class="theater-title"\` 的元素里。
2.  **多样化美化**：你可以自由选择最适合当前小剧场内容和风格的格式，例如：
    *   模仿电影字幕、剧本分镜。
    *   模拟社交平台（如小红书、论坛、朋友圈）的帖子或评论区。
    *   创建角色间的聊天对话界面（对话气泡、头像）。
    *   设计成报告摘要、新闻报道等形式。
    *   **配色建议**：请尽量使用明亮、清爽的浅色调（如白色、米白、淡灰）作为背景，避免使用大面积的深色或黑色背景，以保证良好的阅读体验。

    鼓励根据情节或情绪，使用不同的字体效果（粗体、斜体）、颜色、背景、边框等。
3.  **结构化输出**：
    *   所有输出内容必须包含在一个根 \`<div>\` 容器中。
    *   必须使用标准HTML标签（如\`<div>\`、\`<span>\`、\`<p>\`等）来包装所有文本，包括角色发言和动作描述，不得省略结构。
    *   模拟的页面类型不可省略或忽略（例如，如果是聊天界面，就要有聊天界面的结构）。
4.  **响应式设计**：
    *   所有配色和美化需兼顾移动端和PC端视觉体验。
    *   必须保证自适应屏宽、字号合适、对比度良好。
    *   生成的任何界面都不能在宽度上超出其容器。
    *   禁止插入任何外部图片链接 (\`<img>\` 标签)。

【本次创作任务】
- 小剧场主题：${theme}
- 参与角色及人设：${actorsPersonaPrompt}${writingStylePrompt}

请立即开始创作，直接输出完整的、可渲染的HTML代码片段。`;

        // 4. 调用API
        const response = await fetch(new URL('/v1/chat/completions', apiSettings.url).href, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiSettings.key}` },
            body: JSON.stringify({
                model: apiSettings.model,
                messages: [{ role: "user", content: littleTheaterPrompt }],
                temperature: apiSettings.temp || 0.8,
                stream: false
            })
        });

        if (!response.ok) throw new Error(`API 请求失败，状态: ${response.status}`);
        
        const result = await response.json();
        let htmlContent = '';

        if (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) {
            let rawContent = result.choices[0].message.content.trim();
            
            // 更健壮的清理逻辑：移除前后可能存在的Markdown代码块标记 (```...```)
            // 这个正则表达式会匹配开头的```后面可选的语言标识以及换行符，和结尾的```
            htmlContent = rawContent.replace(/^```[a-zA-Z]*\s*\n?/, '').replace(/\n?```\s*$/, '').trim();

            // 增加一个最终校验，防止内容清理后为空
            if (!htmlContent.startsWith('<')) {
                 // 如果清理后内容不是以HTML标签开头，可能AI返回了非HTML的说明文字
                 console.warn('AI返回内容可能不是有效的HTML片段:', htmlContent);
                 // 尝试从内容中提取第一个HTML标签之后的所有内容，作为最后的补救
                 const firstTagIndex = htmlContent.indexOf('<');
                 if (firstTagIndex !== -1) {
                    htmlContent = htmlContent.substring(firstTagIndex);
                 } else {
                    throw new Error('AI未能返回有效的HTML内容。');
                 }
            }

        } else {
            throw new Error('API未能返回有效的小剧场内容。');
        }

        // 从返回的HTML中提取标题
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const titleElement = tempDiv.querySelector('.theater-title');
        // 优化逻辑：确保即使标题元素存在但内容为空时，也使用默认标题
        const theaterTitle = (titleElement && titleElement.textContent.trim()) || '无题小剧场';

        // 5. 保存结果
        const theaters = JSON.parse(await localforage.getItem('littleTheaters') || '[]');
        theaters.unshift({
            id: 'theater_' + generateId(),
            title: theaterTitle,
            theme: theme,
            actors: actorsInfo,
            htmlContent: htmlContent,
            createdAt: new Date().toISOString()
        });
        await localforage.setItem('littleTheaters', JSON.stringify(theaters));

        // 6. 成功后处理
        document.getElementById('create-theater-overlay').classList.remove('visible');
        showGlobalToast('小剧场生成成功！', { type: 'success' });
        playSoundEffect('完成音效.wav');
        renderLittleTheaterPage();

    } catch (error) {
        console.error('生成小剧场失败:', error);
        showCustomAlert(`生成失败: ${error.message}`);
    } finally {
        confirmBtn.textContent = originalBtnText;
        confirmBtn.disabled = false;
    }
}
