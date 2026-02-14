document.addEventListener('DOMContentLoaded', () => {

    const checkPhoneAppIcon = document.getElementById('app-check-phone');
    if (!checkPhoneAppIcon) return;

    // 状态管理，用于控制返回按钮逻辑
    let currentCheckPhoneView = null; // 'list' or 'simulator'
    let isDynamicIslandSuppressed = false;

    // 获取通用模态框的元素
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // 存储原始的关闭事件，以便在退出App时恢复
    let originalCloseHandler = null;

    function setDynamicIslandSuppressed(suppressed) {
        isDynamicIslandSuppressed = suppressed;
        const dynamicIsland = modalBody.querySelector('.phone-dynamic-island');
        if (!dynamicIsland) return;
        dynamicIsland.style.display = suppressed ? 'none' : '';
    }

    // 1. 打开联系人列表视图
    function openContactList(clickedElement) {
        currentCheckPhoneView = 'list';
        modalBody.classList.remove('phone-view-body');

        // 获取所有可查看的角色（包括User和其他角色）
        // 确保 archiveData 已经定义（它应该在你的主HTML的<script>中）
        // 筛选出所有非 User e的角色
        const characters = (window.archiveData && window.archiveData.characters) ? [...window.archiveData.characters] : [];

        let contactsHTML = '<div class="check-phone-contact-list">';
        if (characters.length > 0) {
            contactsHTML += characters.map(char => `
                <div class="check-phone-contact-item" data-contact-id="${char.id}">
                    <div class="check-phone-avatar" style="background-image: url('${char.avatar}')"></div>
                    <span class="check-phone-name">${escapeHTML(char.name)}</span>
                </div>
            `).join('');
        } else {
            contactsHTML += '<span class="empty-text" style="text-align:center; padding: 40px 0;">档案中没有角色</span>';
        }
        contactsHTML += '</div>';

        openModal('选择要查看的手机', contactsHTML, clickedElement);
    }
    // 渲染手机主屏幕的函数
    function renderPhoneHomeScreen(contact) {
        setDynamicIslandSuppressed(false);
        const screenView = document.getElementById('phone-screen-view');
        if (!screenView) return;

        screenView.innerHTML = `
            <div class="phone-main-content" style="display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; flex-grow: 1;">
                <div id="phone-lock-screen-time">12:00</div>
            </div>
                <div class="phone-dock-container">
                    <!-- 第1行APP -->
                    <div class="app-wrapper" id="phone-settings-btn">
                        <div class="app-icon-box">
                            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M449.194667 82.346667a128 128 0 0 1 125.610666 0l284.16 160a128 128 0 0 1 65.194667 111.530666v316.245334a128 128 0 0 1-65.194667 111.530666l-284.16 160a128 128 0 0 1-125.610666 0l-284.16-160a128 128 0 0 1-65.194667-111.530666V353.877333A128 128 0 0 1 165.034667 242.346667z m83.754666 74.410666a42.666667 42.666667 0 0 0-41.898666 0L206.933333 316.714667a42.666667 42.666667 0 0 0-21.76 37.162666v316.245334a42.666667 42.666667 0 0 0 21.76 37.162666l284.16 160a42.666667 42.666667 0 0 0 41.898667 0l284.16-160a42.666667 42.666667 0 0 0 21.76-37.162666V353.877333a42.666667 42.666667 0 0 0-21.76-37.162666zM512 341.333333a170.666667 170.666667 0 1 1 0 341.333334 170.666667 170.666667 0 0 1 0-341.333334z m0 85.333334a85.333333 85.333333 0 1 0 0 170.666666 85.333333 85.333333 0 0 0 0-170.666666z"></path></svg>
                        </div>
                        <span class="app-name">设置</span>
                    </div>
                    <div class="app-wrapper" id="phone-chat-btn">
                        <div class="app-icon-box">
                            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M381.7 985.3c-10.2 0-20.4-3.9-28.3-11.7-15.6-15.6-15.6-40.9 0-56.5L496 774.5c39-39 90.9-60.5 146.1-60.5h136.2c91.4 0 165.7-74.3 165.8-165.7V284.4c0-91.4-74.4-165.8-165.8-165.8H245.7c-91.4 0-165.8 74.4-165.8 165.8v263.9c0 91.4 74.4 165.7 165.8 165.7h74.4c22.1 0 40 17.9 40 40s-17.9 40-40 40h-74.4C110.2 793.9 0 683.7 0 548.3V284.4C0 148.9 110.2 38.7 245.7 38.7h532.6c135.5 0 245.7 110.2 245.7 245.7v263.9C1024 683.8 913.8 794 778.3 794H642.2c-33.8 0-65.7 13.2-89.6 37.1L410 973.6c-7.8 7.8-18 11.7-28.3 11.7z"></path><path d="M322.965 425.019m-50.6 0a50.6 50.6 0 1 0 101.2 0 50.6 50.6 0 1 0-101.2 0Z"></path><path d="M512.065 425.019m-50.6 0a50.6 50.6 0 1 0 101.2 0 50.6 50.6 0 1 0-101.2 0Z"></path><path d="M701.165 425.019m-50.6 0a50.6 50.6 0 1 0 101.2 0 50.6 50.6 0 1 0-101.2 0Z"></path></svg>
                        </div>
                        <span class="app-name">聊天</span>
                    </div>
                    <div class="app-wrapper" id="phone-photos-btn">
                        <div class="app-icon-box">
                            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M668.1 227.3H207.8C93.2 227.3 0 320.6 0 435.1v296.4c0 114.6 93.2 207.8 207.8 207.8H668c114.6 0 207.8-93.2 207.8-207.8V435.1c0.1-114.5-93.1-207.8-207.7-207.8z m139.8 504.2c0 77.1-62.7 139.8-139.8 139.8H207.8c-57.3 0-106.7-34.7-128.3-84.2l217.8-217.8 134.2 134.2c13.3 13.3 34.8 13.3 48.1 0l88.2-88.2 96.6 96.6c13.3 13.3 34.8 13.3 48.1 0 13.3-13.3 13.3-34.8 0-48.1L592 543.2c-13.3-13.3-34.8-13.3-48.1 0l-88.2 88.2-134.3-134.2c-13.3-13.3-34.8-13.3-48.1 0L68 702.6V435.1c0-77.1 62.7-139.8 139.8-139.8H668c77.1 0 139.8 62.7 139.8 139.8v296.4z"></path><path d="M627.440143 485.154298a53.1 53.1 0 1 0 75.093429-75.096051 53.1 53.1 0 1 0-75.093429 75.096051Z"></path><path d="M675.1 84.6h-288c-18.8 0-34 15.2-34 34s15.2 34 34 34h288c154.9 0 280.9 126 280.9 280.9v149.8c0 18.8 15.2 34 34 34s34-15.2 34-34V433.6c0-192.4-156.5-349-348.9-349z"></path></svg>
                        </div>
                        <span class="app-name">相册</span>
                    </div>
                    <div class="app-wrapper" id="phone-memo-btn">
                        <div class="app-icon-box">
<svg t="1770426785120" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2690" width="200" height="200"><path d="M749.6 64.2H276.4c-74.1 0-134.4 60.3-134.4 134.4v625.2c0 74.1 60.3 134.4 134.4 134.4h473.3c74.1 0 134.4-60.3 134.4-134.4V198.6c-0.1-74.1-60.4-134.4-134.5-134.4zM532.1 118h150v218.8l-55.8-48.4c-0.1-0.1-0.1-0.1-0.2-0.1-0.5-0.4-1-0.7-1.5-1.1-0.3-0.2-0.6-0.6-1-0.8-0.3-0.2-0.6-0.3-0.9-0.5-0.4-0.2-0.7-0.5-1.1-0.7-0.5-0.3-1.1-0.5-1.6-0.7-0.4-0.2-0.7-0.4-1.1-0.6-0.3-0.1-0.7-0.2-1-0.3-0.4-0.1-0.7-0.3-1.1-0.5-0.5-0.2-1.1-0.2-1.6-0.4-0.4-0.1-0.8-0.3-1.3-0.4-0.3-0.1-0.7 0-1-0.1-0.4-0.1-0.8-0.2-1.1-0.2-0.5-0.1-1.1 0-1.7-0.1-0.8 0-1.7-0.1-2.5-0.1h-1c-0.6 0-1.2 0.2-1.8 0.3-0.5 0.1-1 0.1-1.5 0.2-0.3 0.1-0.5 0.2-0.8 0.2-0.3 0.1-0.7 0.1-1 0.2-0.6 0.2-1.1 0.4-1.7 0.6-0.5 0.2-1 0.3-1.5 0.5-0.2 0.1-0.5 0.3-0.7 0.4-0.3 0.2-0.7 0.3-1 0.4-0.5 0.3-1 0.6-1.5 1-0.1 0.1-0.2 0.2-0.4 0.2-0.3 0.2-0.6 0.3-0.9 0.5-0.1 0.1-0.2 0.2-0.4 0.3-0.4 0.3-0.9 0.6-1.3 0.9-0.1 0-0.1 0.1-0.2 0.1L532 335.3V118z m298.1 124.8v580.9c0 44.4-36.2 80.6-80.6 80.6H276.4c-44.4 0-80.6-36.2-80.6-80.6V198.6c0-44.4 36.2-80.6 80.6-80.6h202v273.2c0 0.3 0.1 0.7 0.1 1 0 1 0.2 1.9 0.3 2.9 0.1 0.8 0.2 1.6 0.4 2.4 0.2 0.9 0.5 1.7 0.8 2.5 0.3 0.8 0.6 1.7 1 2.5 0.3 0.7 0.8 1.4 1.2 2.2 0.5 0.8 1 1.7 1.6 2.4 0.2 0.3 0.3 0.6 0.5 0.8 0.3 0.3 0.6 0.5 0.9 0.8 0.8 0.9 1.7 1.8 2.6 2.6 0.6 0.5 1.1 1 1.7 1.4 1 0.7 2 1.3 3.1 1.9 0.6 0.3 1.1 0.7 1.8 1 1.3 0.6 2.6 1 4 1.4 0.5 0.1 0.9 0.3 1.4 0.4 1.8 0.4 3.7 0.6 5.7 0.6 1.7 0 3.3-0.2 4.9-0.5 0.6-0.1 1.1-0.3 1.6-0.4 1-0.3 2.1-0.6 3.1-1 0.6-0.2 1.2-0.5 1.8-0.8 0.9-0.4 1.7-0.9 2.6-1.4l1.8-1.2 0.9-0.6 86-68.5 83.4 72.3c0.4 0.4 0.9 0.7 1.4 1 0.6 0.5 1.2 0.9 1.9 1.4 0.8 0.5 1.7 0.9 2.5 1.4 0.6 0.3 1.3 0.6 1.9 0.9 1 0.4 2 0.7 3.1 1 0.6 0.2 1.1 0.4 1.7 0.5 1.7 0.3 3.4 0.5 5.1 0.5 1.9 0 3.7-0.2 5.5-0.6 0.3-0.1 0.7-0.2 1-0.3 1.4-0.4 2.9-0.8 4.2-1.4 0.6-0.2 1.1-0.6 1.6-0.9 1.1-0.6 2.1-1.1 3.1-1.8 0.6-0.4 1.1-0.9 1.6-1.3 0.9-0.8 1.8-1.5 2.6-2.4l0.6-0.6 0.9-1.2c0.6-0.8 1.1-1.5 1.6-2.3 0.4-0.7 0.8-1.5 1.2-2.2 0.4-0.8 0.8-1.6 1.1-2.4 0.3-0.8 0.6-1.7 0.8-2.5 0.2-0.8 0.4-1.6 0.5-2.5 0.2-0.9 0.2-1.9 0.3-2.8 0-0.5 0.2-1 0.2-1.5V118h13.8c44.4 0 80.6 36.2 80.6 80.6v44.2z" fill="#2c2c2c" p-id="2691"></path></svg>                        </div>
                        <span class="app-name">备忘录</span>
                    </div>
                    <!-- 第2行APP -->
                    <div class="app-wrapper" id="phone-diary-btn">
                        <div class="app-icon-box">
                            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M781.894787 916.954153H241.983061a28.502127 28.502127 0 0 1-27.932085-27.932085 26.873434 26.873434 0 0 1 27.932085-27.932084h539.911726a27.932085 27.932085 0 0 1 0 55.864169z"></path><path d="M888.940634 107.045847a28.502127 28.502127 0 0 0-27.932085 27.932085v807.546701a28.502127 28.502127 0 0 1-27.932085 27.932085H241.983061a81.434649 81.434649 0 0 1 0-162.869299h484.047557a82.452583 82.452583 0 0 0 81.434649-81.43465V81.434649a82.452583 82.452583 0 0 0-81.434649-81.434649h-537.468687a82.452583 82.452583 0 0 0-81.43465 81.434649v807.546702a135.059366 135.059366 0 0 0 134.977932 134.977932h593.455008a82.452583 82.452583 0 0 0 81.43465-81.43465V134.977932a30.049386 30.049386 0 0 0-27.932085-27.932085z m-700.337986-53.543282h539.911726a28.502127 28.502127 0 0 1 27.728498 27.932084v646.998291a28.502127 28.502127 0 0 1-27.932084 27.932084H241.983061a128.055986 128.055986 0 0 0-81.43465 27.932085V81.434649A28.502127 28.502127 0 0 1 188.439779 53.543282z"></path><path d="M539.423118 282.903972a90.026005 90.026005 0 0 0-71.906795 37.622808 89.578114 89.578114 0 0 0-71.906796-37.622808A97.029385 97.029385 0 0 0 303.262635 383.84222a133.959998 133.959998 0 0 0 26.791999 75.286334 664.018132 664.018132 0 0 0 125.653665 124.920752 18.892839 18.892839 0 0 0 23.575331 0 675.907591 675.907591 0 0 0 125.694381-124.920752 134.08215 134.08215 0 0 0 26.792-75.286334 97.029385 97.029385 0 0 0-92.346893-100.938248z m41.775975 175.654539a581.809853 581.809853 0 0 1-103.1777 98.698795 17.50845 17.50845 0 0 1-10.464353 3.745994 15.961191 15.961191 0 0 1-10.464352-3.745994 614.261561 614.261561 0 0 1-103.218419-100.571792 122.436996 122.436996 0 0 1-27.728498-67.427889 74.919878 74.919878 0 0 1 73.291185-84.854905 101.263987 101.263987 0 0 1 68.160801 45.114796 101.793312 101.793312 0 0 1 68.160802-45.114796 76.304267 76.304267 0 0 1 75.286333 84.854905 127.933834 127.933834 0 0 1-29.845799 69.341604z"></path></svg>
                        </div>
                        <span class="app-name">日记</span>
                    </div>
                    <div class="app-wrapper">
                        <div class="app-icon-box">
                            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M719.188806 502.370689c-8.791224-6.794753-14.921851-20.049638-17.475-31.394011-13.746072-61.084217-52.861952-96.336092-115.110691-100.750635-14.048971-0.997724-28.229948-0.147356-40.7194-0.147356-52.967352-73.132624-108.182908-90.663906-190.016705-55.800887-106.270349 45.270043-184.842869 122.044614-232.264924 227.119741-45.124733 99.987249-15.870456 195.124026 74.284867 258.279415 13.898545 9.736758 28.652574 18.788925 44.1178 25.670659 126.434597 56.260351 253.413594 56.302307 379.780653 0.303922 47.445592-21.024849 87.715761-52.40351 118.731148-94.677313C798.582017 651.830699 789.718139 556.89142 719.188806 502.370689zM696.509271 663.451364c-15.629979 27.451212-37.771255 55.168484-63.923892 71.976288-122.589013 78.784344-251.41303 82.528622-379.251603 14.33959-80.213903-42.787502-99.03762-113.996311-57.178257-195.072861 38.214347-74.014714 96.088452-129.578194 170.252569-167.215396 17.319457-8.789177 37.236066-14.778588 56.521295-16.879436 36.882002-4.01443 55.93187 15.223726 55.509245 52.127218-0.140193 12.32777-1.616824 24.641213-2.638083 39.167045 26.091238-6.725168 49.018414-13.537318 72.365144-18.281365 12.257162-2.490727 25.556049-3.363607 37.85312-1.482771 34.779108 5.316076 48.944735 25.369807 43.919279 59.760059-1.397836 9.555633-3.990894 18.936281-6.313799 29.68202 13.916964 6.970762 26.784016 12.529361 38.774095 19.577894C706.20612 576.906266 721.636554 619.315144 696.509271 663.451364z"></path><path d="M921.181263 359.243921c-7.30129-118.797663-100.349499-196.193381-200.75835-202.724121-1.390673 0-5.655813-0.294712-9.869788 0.050142-22.861684 1.866511-35.855626 13.534248-36.906561 32.91669-1.061169 19.578917 9.952676 31.999808 32.903388 36.591383 5.516644 1.104147 11.30037 0.826831 16.856923 1.782599 70.697155 12.170181 112.990401 54.66604 124.826983 125.172861 1.635243 9.738805 2.142803 19.983123 5.653767 29.031197 7.930623 20.444635 30.937616 28.209482 48.937572 17.318434C917.865751 390.280798 922.198429 375.787712 921.181263 359.243921z"></path><path d="M717.520817 281.84104c-23.680329-1.713015-38.666648 7.16826-43.091424 25.539676-4.489244 18.638499 2.833535 34.097586 25.781176 42.317805 15.122419 5.41636 22.314215 12.493545 27.584242 27.757181 7.794523 22.581298 24.603351 30.960129 42.322921 25.353434 18.848277-5.963829 26.53433-20.012799 25.408693-39.331797C795.219433 322.338383 759.414973 284.870026 717.520817 281.84104z"></path></svg>
                        </div>
                        <span class="app-name">微博</span>
                    </div>
                    <div class="app-wrapper">
                        <div class="app-icon-box">
                            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M631.845463 784.995902c-30.045659 0-59.416976-8.604098-84.942048-24.950634L97.205073 471.764293c-49.239415-31.669073-63.850146-97.354927-32.967805-146.869073 0.474537-0.811707 1.011512-1.635902 1.536-2.44761L207.722146 113.414244c40.597854-59.704195 119.970341-76.113171 180.810927-37.013854l564.611122 361.746732c33.617171 21.429073 53.048195 58.068293 51.936781 98.104195-1.261268 40.035902-22.777756 75.476293-57.568781 94.957268L708.795317 764.81561c-23.402146 13.137171-50.051122 20.180293-76.949854 20.180292zM141.099707 371.961756c-0.124878 0.124878-0.22478 0.312195-0.349658 0.499512-5.032585 7.917268-2.734829 18.481951 5.157463 23.502049l449.573464 288.218537c20.76722 13.324488 47.72839 14.198634 69.219902 2.010536L903.492683 552.585366c7.168-3.958634 11.276488-10.752 11.526244-19.043903 0.22478-7.917268-3.521561-15.085268-10.277464-19.356097-0.037463-0.062439-0.062439-0.062439-0.099902-0.062439L339.918049 152.251317c-19.518439-12.57522-44.743805-7.230439-57.656195 11.813463L141.099707 371.961756zM63.925073 968.81639c-24.888195 0-45.056-20.167805-45.056-45.056V603.747902c0-24.888195 20.167805-45.056 45.056-45.056s45.056 20.167805 45.056 45.056v320.012488c0.012488 24.888195-20.167805 45.056-45.056 45.056z"></path><path d="M230.999415 857.525073H63.925073c-24.888195 0-45.056-20.167805-45.056-45.056s20.167805-45.056 45.056-45.056h142.660683l122.580293-188.228683c13.549268-20.867122 41.609366-26.648976 62.314146-13.19961 20.867122 13.574244 26.73639 41.484488 13.162146 62.339122L268.750049 837.032585a45.054751 45.054751 0 0 1-37.750634 20.492488zM209.108293 535.052488c-8.766439 0-17.63278-2.572488-25.425171-7.917268-20.517463-14.011317-25.762341-42.046439-11.726049-62.601366l226.054244-330.202537c14.073756-20.554927 41.984-25.762341 62.626342-11.688585 20.517463 14.011317 25.762341 42.046439 11.726048 62.601366L246.309463 515.446634c-8.741463 12.750049-22.840195 19.605854-37.20117 19.605854z"></path></svg>
                        </div>
                        <span class="app-name">监控</span>
                    </div>
                    <div class="app-wrapper">
                        <div class="app-icon-box">
<svg t="1770427096170" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7783" width="200" height="200"><path d="M85.333333 170.368A42.666667 42.666667 0 0 1 127.658667 128h768.682666c23.381333 0 42.325333 18.986667 42.325334 42.368v683.264a42.666667 42.666667 0 0 1-42.325334 42.368H127.658667A42.368 42.368 0 0 1 85.333333 853.632V170.368zM341.333333 213.333333v597.333334h341.333334V213.333333H341.333333zM170.666667 213.333333v85.333334h85.333333V213.333333H170.666667z m597.333333 0v85.333334h85.333333V213.333333h-85.333333zM170.666667 384v85.333333h85.333333V384H170.666667z m597.333333 0v85.333333h85.333333V384h-85.333333zM170.666667 554.666667v85.333333h85.333333v-85.333333H170.666667z m597.333333 0v85.333333h85.333333v-85.333333h-85.333333zM170.666667 725.333333v85.333334h85.333333v-85.333334H170.666667z m597.333333 0v85.333334h85.333333v-85.333334h-85.333333z" p-id="7784"></path></svg>                        </div>
                        <span class="app-name">往事</span>
                    </div>
                </div>
        `;

        const dockContainer = screenView.querySelector('.phone-dock-container');
        if (dockContainer) {
            const findByName = (name) => Array.from(dockContainer.querySelectorAll('.app-wrapper')).find(el => ((el.querySelector('.app-name')?.textContent) || '').trim() === name);
            const ensureId = (el, id) => {
                if (el && !el.id) el.id = id;
                return el;
            };
            const createApp = ({ id, name, svg }) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'app-wrapper';
                wrapper.id = id;
                wrapper.innerHTML = `
                    <div class="app-icon-box">
                        ${svg}
                    </div>
                    <span class="app-name">${name}</span>
                `;
                return wrapper;
            };

            const settingsEl = dockContainer.querySelector('#phone-settings-btn');
            const chatEl = dockContainer.querySelector('#phone-chat-btn');
            const photosEl = dockContainer.querySelector('#phone-photos-btn');
            const memoEl = dockContainer.querySelector('#phone-memo-btn');
            const diaryEl = dockContainer.querySelector('#phone-diary-btn');

            const weiboEl = ensureId(findByName('微博'), 'phone-weibo-btn');
            const monitorEl = ensureId(findByName('监控'), 'phone-monitor-btn');
            const pastEl = ensureId(findByName('往事'), 'phone-past-btn');

            const browserEl = createApp({
                id: 'phone-browser-btn',
                name: '浏览器',
                svg: `
                    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667z m0 64C288.149333 106.666667 106.666667 288.149333 106.666667 512s181.482667 405.333333 405.333333 405.333333 405.333333-181.482667 405.333333-405.333333S735.850667 106.666667 512 106.666667z m180.202667 264.426666l-64 234.666667a32 32 0 0 1-22.442667 22.442667l-234.666667 64a32 32 0 0 1-39.296-39.296l64-234.666667a32 32 0 0 1 22.442667-22.442667l234.666667-64a32 32 0 0 1 39.296 39.296z m-76.48 37.184l-162.986667 44.458667-44.458667 162.986667 162.986667-44.458667 44.458667-162.986667z"></path>
                    </svg>
                `
            });
            const walletEl = createApp({
                id: 'phone-wallet-btn',
                name: '钱包',
                svg: `
                    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M896 324.010667a352.853333 352.853333 0 0 0-2.005333-45.013334A55.637333 55.637333 0 0 0 885.973333 256a44.245333 44.245333 0 0 0-22.016-22.016 54.784 54.784 0 0 0-22.997333-8.021333 361.472 361.472 0 0 0-45.013333-2.005334H227.968a352.853333 352.853333 0 0 0-45.013333 2.005334 55.594667 55.594667 0 0 0-22.997334 8.021333c-9.984 4.693333-17.322667 11.989333-22.016 22.016-4.010667 5.973333-6.656 13.653333-7.978666 23.04-1.322667 9.301333-2.005333 24.32-2.048 44.970667v375.978666c0 20.693333 0.682667 35.669333 2.048 45.013334 1.322667 9.301333 4.010667 16.981333 7.978666 22.997333 4.693333 9.984 12.032 17.322667 22.016 22.016 5.973333 4.010667 13.653333 6.656 23.04 7.978667 9.301333 1.322667 24.32 2.005333 44.970667 2.048h567.978667a352.853333 352.853333 0 0 0 45.013333-2.048c9.344-1.322667 16.981333-4.010667 23.04-7.978667 9.984-4.693333 17.322667-12.032 21.973333-22.016 4.010667-5.973333 6.698667-13.653333 8.021334-23.04 1.28-9.301333 2.005333-24.32 2.005333-44.970667V324.010667z m64 0v375.978666c0 28.032-1.493333 49.024-4.522667 63.018667-2.986667 13.994667-7.168 25.642667-12.501333 34.986667-11.349333 21.333333-27.306667 37.674667-48 49.024a138.282667 138.282667 0 0 1-36.010667 12.501333c-13.994667 2.986667-34.986667 4.522667-63.018666 4.522667H227.968c-28.032 0-49.024-1.536-63.018667-4.522667a138.368 138.368 0 0 1-36.010666-12.501333 118.698667 118.698667 0 0 1-48-48 138.24 138.24 0 0 1-12.501334-36.010667c-2.986667-13.994667-4.522666-34.986667-4.522666-63.018667V324.010667c0-28.032 1.536-49.024 4.522666-63.018667 2.986667-13.994667 7.168-26.026667 12.501334-36.010667 11.349333-20.650667 27.349333-36.693333 48-48a138.24 138.24 0 0 1 36.010666-12.501333c13.994667-2.986667 34.986667-4.522667 63.018667-4.522667h567.978667c28.032 0 49.066667 1.493333 63.018666 4.522667 13.994667 2.986667 25.685333 7.168 34.986667 12.501333 21.333333 11.349333 37.674667 27.306667 49.024 48 5.333333 10.026667 9.514667 22.016 12.501333 36.010667 2.986667 13.994667 4.522667 34.986667 4.522667 63.018667zM64 320h896V384h-896V320z m0 128h896V512h-896v-64z m128 192h256v64h-256V640z"></path>
                    </svg>
                `
            });
            const healthEl = createApp({
                id: 'phone-health-btn',
                name: '健康',
                svg: `
                    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M879.2 140.8a32 32 0 0 0-26.5-23.6 966.4 966.4 0 0 0-294.7 6.3C419.4 148.9 310 204.6 231.7 289.1 82 451.5 163.5 704.5 184.1 760a557.9 557.9 0 0 0-21.1 122.1 31.9 31.9 0 0 0 30.9 33h1.1a32 32 0 0 0 31.9-30.8c0-3.1 14.4-306.7 306.7-486A32 32 0 1 0 500 343.8a702.5 702.5 0 0 0-278.6 313.6c-20-90.6-30-230 57.3-324.9 142.2-154.2 380.5-163.9 498.4-157.9-48.7 63.3-57.1 135.9-64.8 206.5-10.6 93.6-20 182.1-115.3 267.1C483.2 750 320.9 732.3 319.3 732.1a32 32 0 0 0-7.8 63.5 340.9 340.9 0 0 0 40 2c63.7 0 188.5-12.7 288.5-101.8C752.6 594.6 765 485 775.9 388.3c10-84.4 17.7-157.2 91.8-214a31.8 31.8 0 0 0 11.5-33.5z"></path>
                    </svg>
                `
            });
            const instanceEl = createApp({
                id: 'phone-instance-btn',
                name: '副本',
                svg: `
                    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M598.1 392.7m-56.8 0a56.8 56.8 0 1 0 113.6 0 56.8 56.8 0 1 0-113.6 0Z"></path>
                        <path d="M434.6 392.7m-33.8 0a33.8 33.8 0 1 0 67.6 0 33.8 33.8 0 1 0-67.6 0Z"></path>
                        <path d="M236.6 828.1c-68.7 0-123.9-20.2-152.4-67.5-37.3-62-14.6-148.9 63.9-244.8 4.6-5.4 19.2-21.7 37-30 22.4-10.5 49-0.8 59.5 21.6 10.4 22.4 0.8 49-21.6 59.5-0.7 0.6-4.7 4.6-6 6.2-59.9 73.2-67.7 122-56 141.3 28.6 47.6 208 33.8 423.7-96.2 99.8-60.2 184-131.7 237-201.2 41.8-54.9 59.9-105.4 45.9-128.6-12.7-21.1-57.8-29.5-117.6-22-12.1 1.5-25 3.7-38.1 6.5-24.3 5.1-47.9-10.4-53-34.6-5.1-24.2 10.4-47.9 34.6-53 15.6-3.3 30.8-5.8 45.4-7.7 127.9-16.1 182.3 26.3 205.4 64.7 35.1 58.2 16.8 139.6-51.4 229-59.7 78.3-152.8 157.6-262.1 223.5-129.9 78.3-280.7 133.3-394.2 133.3z"></path>
                        <path d="M529.8 874.7c-200.4 0-363.5-163.1-363.5-363.5s163.1-363.5 363.5-363.5 363.5 163.1 363.5 363.5-163 363.5-363.5 363.5z m0-637.5c-151.1 0-274 122.9-274 274s122.9 274 274 274 274-122.9 274-274-122.9-274-274-274z"></path>
                    </svg>
                `
            });

            const ordered = [
                settingsEl,
                chatEl,
                photosEl,
                memoEl,
                browserEl,
                walletEl,
                healthEl,
                weiboEl,
                diaryEl,
                monitorEl,
                instanceEl,
                pastEl
            ].filter(Boolean);

            dockContainer.innerHTML = '';
            ordered.forEach(el => dockContainer.appendChild(el));
        }

        // 获取并应用壁纸
        const phoneFrame = document.querySelector('.phone-simulator-frame');
        if (phoneFrame) {
            const wallpaperKey = `phone_wallpaper_${contact.id}`;
            localforage.getItem(wallpaperKey).then(savedWallpaper => {
                if (savedWallpaper) {
                    phoneFrame.style.backgroundImage = `url('${savedWallpaper}')`;
                    phoneFrame.style.backgroundSize = 'cover';
                    phoneFrame.style.backgroundPosition = 'center';
                } else {
                    phoneFrame.style.backgroundImage = '';
                }
            });
        }
        
        // 绑定新添加的设置按钮事件
        const settingsBtn = document.getElementById('phone-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                openPhoneSettings(contact);
            });
        }
    }

    // 2. 打开手机模拟器视图 (已重构)
    function openPhoneSimulator(contact) {
        currentCheckPhoneView = 'simulator';
        setDynamicIslandSuppressed(false);

        const modalHeader = document.getElementById('modal-header');
        if(modalHeader) modalHeader.style.display = 'none';

        modalBody.classList.add('phone-view-body');

        modalBody.innerHTML = `
            <div class="phone-simulator-frame">
                <div class="phone-dynamic-island"></div>
                <div id="phone-screen-view" style="height: 100%; display: flex; flex-direction: column;">
                    <!-- 手机屏幕内容会动态渲染到这里 -->
                </div>
            </div>
        `;
        
        renderPhoneHomeScreen(contact);
        
        const dynamicIsland = modalBody.querySelector('.phone-dynamic-island');
        let longPressTimer = null;

        if (dynamicIsland) {
            const startLongPress = (e) => {
                e.preventDefault();
                clearTimeout(longPressTimer);
                longPressTimer = setTimeout(() => {
                    showCustomConfirm('确定要退出当前手机界面吗？', () => {
                        handleCheckPhoneBack();
                    });
                }, 500);
            };
            const cancelLongPress = () => {
                clearTimeout(longPressTimer);
            };

            dynamicIsland.addEventListener('contextmenu', e => e.preventDefault());
            dynamicIsland.addEventListener('mousedown', startLongPress);
            dynamicIsland.addEventListener('touchstart', startLongPress, { passive: false });
            dynamicIsland.addEventListener('mouseup', cancelLongPress);
            dynamicIsland.addEventListener('mouseleave', cancelLongPress);
            dynamicIsland.addEventListener('touchend', cancelLongPress);
            dynamicIsland.addEventListener('touchmove', cancelLongPress, { passive: true });
            
            // 双击灵动岛触发生成
            const handleDynamicIslandDoubleTap = () => {
                showCustomConfirm('确定要开始生成手机内容吗？', () => {
                     generatePhoneContent(contact);
                });
            };

            dynamicIsland.addEventListener('dblclick', handleDynamicIslandDoubleTap);

            // 移动端双击检测
            let lastTapTime = 0;
            dynamicIsland.addEventListener('touchend', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTapTime;
                if (tapLength < 300 && tapLength > 0) {
                    e.preventDefault(); // 防止触发缩放等默认行为
                    handleDynamicIslandDoubleTap();
                }
                lastTapTime = currentTime;
            });
        }
        
        // 新增：为手机屏幕添加事件委托
        const screenView = document.getElementById('phone-screen-view');
        if (screenView) {
            screenView.addEventListener('click', e => {
                if (e.target.closest('#phone-chat-btn')) {
                    openChatView(contact);
                } else if (e.target.closest('#phone-photos-btn')) {
                    openPhotosView(contact);
                } else if (e.target.closest('#phone-memo-btn')) {
                    openMemoView(contact);
                } else if (e.target.closest('#phone-browser-btn')) {
                    openBrowserView(contact);
                } else if (e.target.closest('#phone-wallet-btn')) {
                    openWalletView(contact);
                } else if (e.target.closest('#phone-health-btn')) {
                    openHealthView(contact);
                } else if (e.target.closest('#phone-weibo-btn')) {
                    openWeiboView(contact);
                } else if (e.target.closest('#phone-diary-btn')) {
                    openDiaryView(contact);
                } else if (e.target.closest('#phone-monitor-btn')) {
                    openMonitorView(contact);
                } else if (e.target.closest('#phone-instance-btn')) {
                    openInstanceInPhoneView(contact);
                } else if (e.target.closest('#phone-past-btn')) {
                    openPastView(contact);
                }
            });
        }
    }


    // 3. 为“查手机”App图标绑定主入口事件
    checkPhoneAppIcon.addEventListener('click', function(e) {
        // 保存并覆盖原始返回按钮事件
        if (!originalCloseHandler) {
            originalCloseHandler = modalCloseBtn.onclick;
        }
        modalCloseBtn.onclick = handleCheckPhoneBack;
        
        openContactList(e.currentTarget);
    });

    // 4. 使用事件委托处理联系人列表的点击
    modalBody.addEventListener('click', function(e) {
        // 确保该逻辑只在“查手机”的列表视图中生效
        if (currentCheckPhoneView !== 'list') return;

        const contactItem = e.target.closest('.check-phone-contact-item');
        if (contactItem) {
            const contactId = contactItem.dataset.contactId;
            const allProfiles = [window.archiveData.user, ...window.archiveData.characters];
            const selectedContact = allProfiles.find(p => p.id === contactId);

            if (selectedContact) {
                openPhoneSimulator(selectedContact);
            }
        }
    });

    // 5. 自定义的返回按钮处理函数
    function handleCheckPhoneBack() {
        // 获取顶栏，无论何时返回都需要恢复它
        const modalHeader = document.getElementById('modal-header');
        if(modalHeader) modalHeader.style.display = 'flex';

        if (currentCheckPhoneView === 'simulator' || currentCheckPhoneView === 'settings') {
            // 从模拟器或其内部设置视图返回到联系人列表视图
            openContactList(checkPhoneAppIcon);
        } else if (currentCheckPhoneView === 'list') {
            // 从列表视图返回，即关闭整个App
            closeModal();
            // 恢复原始的关闭事件
            modalCloseBtn.onclick = originalCloseHandler;
            currentCheckPhoneView = null;
            originalCloseHandler = null;
        } else {
            // 异常情况，直接关闭
            if(typeof closeModal === 'function') closeModal();
            if(originalCloseHandler) modalCloseBtn.onclick = originalCloseHandler;
            currentCheckPhoneView = null;
            originalCloseHandler = null;
        }
    }
    // 新增：打开手机内部设置页面的函数
    function openPhoneSettings(contact) {
        // 更新视图状态
        currentCheckPhoneView = 'settings';
        setDynamicIslandSuppressed(true);
        
        // 清除背景图
        const phoneFrame = document.querySelector('.phone-simulator-frame');
        if (phoneFrame) phoneFrame.style.backgroundImage = 'none';
        
        const screenView = document.getElementById('phone-screen-view');
        if (!screenView) return;

        // 设置页面的HTML结构，注意添加了内联的padding-top
        const settingsHTML = `
            <div style="padding: 18px 20px 20px; display: flex; flex-direction: column; height: 100%; color: var(--text-color); overflow-y: auto;">
                <div style="display: flex; align-items: center; margin-bottom: 20px; position: relative; justify-content: center; flex-shrink: 0;">
                    <button id="phone-settings-back-btn" style="position: absolute; left: 0; background: none; border: none; cursor: pointer; padding: 4px;">
                        <svg viewBox="0 0 24 24" style="width: 28px; height: 28px; fill: currentColor;"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                    </button>
                    <h4 style="margin: 0; font-size: 18px; font-weight: 600;">手机设置</h4>
                </div>
                <div style="flex-grow: 1;">
                    <button id="phone-wallpaper-btn" style="width: 100%; padding: 12px; font-size: 16px; border-radius: 10px; border: 1px solid var(--glass-border); background: var(--glass-bg); color: var(--text-color); cursor: pointer; text-align: left;">
                        设置壁纸
                    </button>
                    <input type="file" id="phone-wallpaper-input" hidden accept="image/*">
                </div>
            </div>
        `;
        
        // 直接替换屏幕内容
        screenView.innerHTML = settingsHTML;

        // 绑定设置界面内的事件
        const backBtn = document.getElementById('phone-settings-back-btn');
        const wallpaperBtn = document.getElementById('phone-wallpaper-btn');
        const wallpaperInput = document.getElementById('phone-wallpaper-input');

        // 返回按钮：点击后重新渲染主屏幕
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                currentCheckPhoneView = 'simulator'; // 更新状态
                renderPhoneHomeScreen(contact);
            });
        }

        // 设置壁纸按钮：触发文件选择器
        if (wallpaperBtn && wallpaperInput) {
            wallpaperBtn.addEventListener('click', () => {
                wallpaperInput.click();
            });

            // 文件选择后的处理
            wallpaperInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const imageUrl = event.target.result;
                        
                        // 1. 定义存储键
                        const wallpaperKey = `phone_wallpaper_${contact.id}`;
                        
                        // 2. 将壁纸保存到 localforage
                        localforage.setItem(wallpaperKey, imageUrl);
                        
                        // 4. 给出成功提示
                        showGlobalToast('壁纸设置成功！', { type: 'success', duration: 2000 });
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    function renderPhoneAppPage(contact, viewKey, title, bodyHTML, options = {}) {
        currentCheckPhoneView = viewKey;

        const suppressDynamicIsland = !(options && options.suppressDynamicIsland === false);
        setDynamicIslandSuppressed(suppressDynamicIsland);
        const paddingTop = suppressDynamicIsland ? 18 : 50;

        const phoneFrame = document.querySelector('.phone-simulator-frame');
        if (phoneFrame) phoneFrame.style.backgroundImage = 'none';

        const screenView = document.getElementById('phone-screen-view');
        if (!screenView) return null;

        screenView.innerHTML = `
            <div style="padding: ${paddingTop}px 16px 16px; display: flex; flex-direction: column; height: 100%; color: var(--text-color); overflow: hidden;">
                <div style="display: flex; align-items: center; margin-bottom: 12px; position: relative; justify-content: center; flex-shrink: 0;">
                    <button id="phone-generic-back-btn" style="position: absolute; left: 0; background: none; border: none; cursor: pointer; padding: 4px;">
                        <svg viewBox="0 0 24 24" style="width: 28px; height: 28px; fill: currentColor;"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                    </button>
                    <h4 style="margin: 0; font-size: 18px; font-weight: 600;">${escapeHTML(title)}</h4>
                </div>
                <div id="phone-generic-body" style="flex-grow: 1; overflow-y: auto;">
                    ${bodyHTML}
                </div>
            </div>
        `;

        const backBtn = document.getElementById('phone-generic-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                currentCheckPhoneView = 'simulator';
                renderPhoneHomeScreen(contact);
            });
        }

        return document.getElementById('phone-generic-body');
    }

    async function openBrowserView(contact) {
        const storageKey = `phone_data_${contact.id}`;
        const phoneDataRaw = await localforage.getItem(storageKey);
        const phoneData = phoneDataRaw ? JSON.parse(phoneDataRaw) : null;
        const searches = (phoneData && phoneData.browser && Array.isArray(phoneData.browser.searches)) ? phoneData.browser.searches : [];

        const listHTML = searches.length
            ? `
                <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">
                    ${searches.slice(-30).reverse().map(item => `
                        <div style="padding: 12px; border-radius: 14px; border: 1px solid var(--glass-border); background: var(--glass-bg);">
                            <div style="font-weight: 600; font-size: 14px; line-height: 1.4; word-break: break-word;">${escapeHTML(item.query || '')}</div>
                            <div style="display: flex; gap: 10px; align-items: center; margin-top: 6px;">
                                ${item.time ? `<span style="font-size: 12px; opacity: 0.7;">${escapeHTML(item.time)}</span>` : ''}
                                ${item.intent ? `<span style="font-size: 12px; opacity: 0.7; word-break: break-word;">${escapeHTML(item.intent)}</span>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `
            : `<div class="empty-text" style="padding: 30px 0; text-align:center;">暂无搜索记录<br><span style="font-size:12px; opacity:0.7">回到主屏双击灵动岛生成内容</span></div>`;

        const bodyHTML = `
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="width: 82%; display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 999px; border: 1px solid var(--glass-border); background: var(--glass-bg); color: var(--text-color); pointer-events: none;">
                    <svg fill="none" height="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </svg>
                    <input type="text" readonly tabindex="-1" value="" style="flex: 1; min-width: 0; border: none; background: transparent; color: var(--text-color); outline: none; padding: 0;">
                </div>
                ${listHTML}
            </div>
        `;

        renderPhoneAppPage(contact, 'browser', '浏览器', bodyHTML, { suppressDynamicIsland: true });
    }

    async function openWalletView(contact) {
        const storageKey = `phone_data_${contact.id}`;
        const phoneDataRaw = await localforage.getItem(storageKey);
        const phoneData = phoneDataRaw ? JSON.parse(phoneDataRaw) : null;
        const wallet = (phoneData && phoneData.wallet && typeof phoneData.wallet === 'object') ? phoneData.wallet : null;
        const balance = wallet && typeof wallet.balance === 'number' ? wallet.balance : null;
        const bills = wallet && Array.isArray(wallet.bills) ? wallet.bills : [];

        const billsHTML = bills.length
            ? `
                <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
                    ${bills.slice(-40).reverse().map(b => {
                        const isIncome = b.type === 'income';
                        const sign = isIncome ? '+' : '-';
                        const color = isIncome ? '#22c55e' : '#ef4444';
                        const amount = Number(b.amount || 0).toFixed(2);
                        return `
                            <div style="padding: 12px; border-radius: 14px; border: 1px solid var(--glass-border); background: var(--glass-bg); display: flex; justify-content: space-between; gap: 10px;">
                                <div style="min-width: 0;">
                                    <div style="font-weight: 600; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(b.title || '')}</div>
                                    <div style="font-size: 12px; opacity: 0.7; margin-top: 4px;">${escapeHTML(b.time || '')}${b.note ? ` · ${escapeHTML(b.note)}` : ''}</div>
                                </div>
                                <div style="font-weight: 700; color: ${color}; flex-shrink: 0;">${sign}¥${amount}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `
            : `<div class="empty-text" style="margin-top: 10px;">暂无记录<br><span style="font-size:12px; opacity:0.7">回到主屏双击灵动岛生成内容</span></div>`;

        const bodyHTML = `
            <div style="display: grid; gap: 12px;">
                <div style="padding: 14px; border-radius: 14px; border: 1px solid var(--glass-border); background: var(--glass-bg);">
                    <div style="font-size: 12px; opacity: 0.7;">余额</div>
                    <div style="font-size: 28px; font-weight: 600; margin-top: 6px;">${balance === null ? '—' : `¥ ${Number(balance).toFixed(2)}`}</div>
                </div>
                <div style="padding: 14px; border-radius: 14px; border: 1px solid var(--glass-border); background: var(--glass-bg);">
                    <div style="font-size: 12px; opacity: 0.7;">账单</div>
                    ${billsHTML}
                </div>
            </div>
        `;

        renderPhoneAppPage(contact, 'wallet', '钱包', bodyHTML, { suppressDynamicIsland: true });
    }

    async function openHealthView(contact) {
        const storageKey = `phone_data_${contact.id}`;
        const phoneDataRaw = await localforage.getItem(storageKey);
        const phoneData = phoneDataRaw ? JSON.parse(phoneDataRaw) : null;
        const health = (phoneData && phoneData.health && typeof phoneData.health === 'object') ? phoneData.health : null;

        const sleep = health && health.sleep ? health.sleep : null;
        const exercise = health && health.exercise ? health.exercise : null;
        const stress = health && health.stress ? health.stress : null;
        const diet = health && health.diet ? health.diet : null;

        const card = ({ key, title, subtitle, extraStyle = '' }) => `
            <button type="button" data-health="${key}" style="width: 100%; height: 100%; text-align: left; border: 1px solid var(--glass-border); background: var(--glass-bg); color: var(--text-color); border-radius: 18px; padding: 14px; cursor: pointer; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; ${extraStyle}">
                <div style="font-weight: 700; font-size: 14px;">${escapeHTML(title)}</div>
                <div style="font-size: 26px; font-weight: 800; line-height: 1.1; word-break: break-word;">${escapeHTML(subtitle)}</div>
            </button>
        `;

        const sleepSubtitle = sleep && sleep.duration ? sleep.duration : '—';
        const exerciseSubtitle = exercise && exercise.duration ? exercise.duration : '—';
        const stressSubtitle = stress && stress.summary ? stress.summary : '—';
        const dietSubtitle = diet && typeof diet.score === 'number' ? `${diet.score}/100` : '—';

        const bodyHTML = health
            ? `
                <div id="health-root" style="height: 100%; display: flex; flex-direction: column;">
                    <div id="health-cards" style="flex: 1; display: grid; gap: 12px; height: 100%; grid-template-columns: 1fr 1fr; grid-template-rows: 1.2fr 1.2fr 1fr; grid-template-areas: 'sleep stress' 'sleep stress' 'exercise diet';">
                        <div style="grid-area: sleep;">${card({ key: 'sleep', title: '睡眠', subtitle: sleepSubtitle })}</div>
                        <div style="grid-area: stress;">${card({ key: 'stress', title: '压力', subtitle: stressSubtitle })}</div>
                        <div style="grid-area: exercise;">${card({ key: 'exercise', title: '运动', subtitle: exerciseSubtitle })}</div>
                        <div style="grid-area: diet;">${card({ key: 'diet', title: '饮食', subtitle: dietSubtitle })}</div>
                    </div>
                    <div id="health-detail" style="display:none; padding-top: 6px; flex: 1; overflow-y: auto;"></div>
                </div>
            `
            : `<div class="empty-text" style="padding: 30px 0; text-align:center;">暂无健康数据<br><span style="font-size:12px; opacity:0.7">回到主屏双击灵动岛生成内容</span></div>`;

        const bodyEl = renderPhoneAppPage(contact, 'health', '健康', bodyHTML, { suppressDynamicIsland: true });
        if (!bodyEl || !health) return;

        const cardsEl = bodyEl.querySelector('#health-cards');
        const detailEl = bodyEl.querySelector('#health-detail');
        if (!cardsEl || !detailEl) return;

        const parsePart = (value) => {
            const [dur = '', pct = ''] = String(value || '').split('|').map(s => s.trim());
            const pctNum = Number(pct);
            return { dur, pct: Number.isFinite(pctNum) ? pctNum : null };
        };

        const renderStressChart = (points) => {
            const safe = Array.isArray(points) ? points.filter(p => p && Number.isFinite(p.value)) : [];
            if (safe.length < 2) return '';
            const w = 280;
            const h = 120;
            const pad = 10;
            const values = safe.map(p => p.value);
            const min = Math.min(...values, 0);
            const max = Math.max(...values, 100);
            const xStep = (w - pad * 2) / (safe.length - 1);
            const mapY = (v) => {
                const t = (v - min) / (max - min || 1);
                return pad + (h - pad * 2) * (1 - t);
            };
            const pts = safe.map((p, i) => `${pad + i * xStep},${mapY(p.value)}`).join(' ');
            return `
                <svg viewBox="0 0 ${w} ${h}" width="100%" height="140" style="display:block;">
                    <polyline points="${pts}" fill="none" stroke="currentColor" stroke-opacity="0.85" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline>
                </svg>
            `;
        };

        const showDetail = (key) => {
            cardsEl.style.display = 'none';
            detailEl.style.display = 'block';

            const header = (title) => `
                <div style="display:flex; align-items:center; justify-content: space-between; margin-bottom: 12px;">
                    <div style="font-weight: 700; font-size: 16px;">${escapeHTML(title)}</div>
                    <button type="button" data-health-back="1" style="border: 1px solid var(--glass-border); background: var(--glass-bg); color: var(--text-color); border-radius: 999px; padding: 8px 12px; cursor: pointer;">返回</button>
                </div>
            `;

            const cardBox = (inner) => `<div style="padding: 14px; border-radius: 16px; border: 1px solid var(--glass-border); background: var(--glass-bg); margin-bottom: 12px;">${inner}</div>`;

            if (key === 'sleep') {
                const awake = parsePart(sleep && sleep.awake);
                const rem = parsePart(sleep && sleep.rem);
                const core = parsePart(sleep && sleep.core);
                const deep = parsePart(sleep && sleep.deep);
                const rows = [
                    { label: '清醒', ...awake },
                    { label: '快速眼动', ...rem },
                    { label: '核心睡眠', ...core },
                    { label: '深度睡眠', ...deep }
                ].filter(r => r.dur);

                detailEl.innerHTML = `
                    ${header('睡眠')}
                    ${cardBox(`
                        <div style="font-size: 22px; font-weight: 800;">${escapeHTML(sleep && sleep.duration ? sleep.duration : '—')}</div>
                        <div style="font-size: 12px; opacity: 0.7; margin-top: 6px;">${escapeHTML(sleep && sleep.start ? sleep.start : '')}${sleep && sleep.end ? ` → ${escapeHTML(sleep.end)}` : ''}</div>
                    `)}
                    ${rows.map(r => cardBox(`
                        <div style="display:flex; justify-content: space-between; align-items:center;">
                            <div style="font-weight: 700;">${escapeHTML(r.label)}</div>
                            <div style="opacity:0.75;">${escapeHTML(r.dur)}${r.pct !== null ? ` · ${r.pct}%` : ''}</div>
                        </div>
                    `)).join('')}
                `;
            } else if (key === 'exercise') {
                const items = (exercise && Array.isArray(exercise.activities)) ? exercise.activities : [];
                detailEl.innerHTML = `
                    ${header('运动')}
                    ${cardBox(`
                        <div style="font-size: 22px; font-weight: 800;">${escapeHTML(exercise && exercise.duration ? exercise.duration : '—')}</div>
                        <div style="font-size: 12px; opacity: 0.7; margin-top: 6px;">运动总时长</div>
                    `)}
                    ${items.length ? items.map(it => cardBox(`
                        <div style="display:flex; justify-content: space-between; gap: 10px; align-items:flex-start;">
                            <div style="min-width: 0;">
                                <div style="font-weight: 700;">${escapeHTML(it.name || '')}</div>
                                <div style="font-size: 12px; opacity: 0.75; margin-top: 4px;">${escapeHTML(it.time || '')}</div>
                            </div>
                            <div style="font-weight: 800; flex-shrink: 0;">${it.calories !== null ? `${escapeHTML(String(it.calories))} kcal` : '—'}</div>
                        </div>
                    `)).join('') : '<span class=\"empty-text\">暂无运动项目</span>'}
                `;
            } else if (key === 'stress') {
                const points = (stress && Array.isArray(stress.points)) ? stress.points : [];
                const reasons = (stress && Array.isArray(stress.reasons)) ? stress.reasons : [];
                detailEl.innerHTML = `
                    ${header('压力')}
                    ${cardBox(`
                        <div style="font-size: 22px; font-weight: 800;">${escapeHTML(stress && stress.summary ? stress.summary : '—')}</div>
                        <div style="font-size: 12px; opacity: 0.7; margin-top: 6px;">压力趋势</div>
                        <div style="margin-top: 10px;">${renderStressChart(points)}</div>
                    `)}
                    ${reasons.length ? reasons.map(r => cardBox(`
                        <div style="font-weight: 700;">${escapeHTML(r.time || '')}</div>
                        <div style="opacity: 0.8; margin-top: 6px; line-height: 1.5; white-space: pre-wrap; word-break: break-word;">${escapeHTML(r.reason || '')}</div>
                    `)).join('') : '<span class=\"empty-text\">暂无原因记录</span>'}
                `;
            } else if (key === 'diet') {
                const meals = (diet && Array.isArray(diet.meals)) ? diet.meals : [];
                detailEl.innerHTML = `
                    ${header('饮食')}
                    ${cardBox(`
                        <div style="font-size: 22px; font-weight: 800;">${typeof diet.score === 'number' ? `${diet.score}/100` : '—'}</div>
                        <div style="font-size: 12px; opacity: 0.7; margin-top: 6px;">饮食健康评分</div>
                    `)}
                    ${meals.length ? meals.map(m => cardBox(`
                        <div style="display:flex; justify-content: space-between; align-items:flex-start; gap: 10px;">
                            <div style="font-weight: 700; flex-shrink:0;">${escapeHTML(m.time || '')}</div>
                            <div style="opacity: 0.85; line-height: 1.5; white-space: pre-wrap; word-break: break-word; text-align: right;">${escapeHTML(m.content || '')}</div>
                        </div>
                    `)).join('') : '<span class=\"empty-text\">暂无饮食记录</span>'}
                `;
            }
        };

        bodyEl.addEventListener('click', (e) => {
            const back = e.target.closest('button[data-health-back]');
            if (back) {
                detailEl.style.display = 'none';
                cardsEl.style.display = '';
                detailEl.innerHTML = '';
                return;
            }

            const btn = e.target.closest('button[data-health]');
            if (!btn) return;
            showDetail(btn.dataset.health);
        });
    }

    async function openWeiboView(contact) {
        const storageKey = `phone_data_${contact.id}`;
        const phoneDataRaw = await localforage.getItem(storageKey);
        const phoneData = phoneDataRaw ? JSON.parse(phoneDataRaw) : null;

        const photos = (phoneData && Array.isArray(phoneData.photos)) ? phoneData.photos : [];
        const memos = (phoneData && Array.isArray(phoneData.memos)) ? phoneData.memos : [];

        const wallpaperKey = `phone_wallpaper_${contact.id}`;
        const wallpaper = await localforage.getItem(wallpaperKey);

        const avatarUrl = contact && contact.avatar ? contact.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(contact && contact.name ? contact.name : 'weibo')}`;

        const coverStyle = wallpaper
            ? `background-image: url('${wallpaper}'); background-size: cover; background-position: center;`
            : `background: linear-gradient(135deg, rgba(0,0,0,0.08), rgba(0,0,0,0.02));`;

        const galleryItems = photos.slice(-6).reverse();
        const galleryHTML = galleryItems.length
            ? `
                <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin-top: 12px;">
                    ${galleryItems.map(p => `
                        <div style="aspect-ratio: 1; border-radius: 10px; border: 1px solid var(--glass-border); background: ${escapeHTML(p.color || 'rgba(0,0,0,0.06)')}; overflow: hidden;"></div>
                    `).join('')}
                </div>
            `
            : `<div class="empty-text" style="margin-top: 12px; text-align:left;">暂无图集</div>`;

        const stat = (label, value) => `
            <div style="min-width: 0;">
                <div style="font-weight: 800; font-size: 18px; line-height: 1;">${escapeHTML(String(value))}</div>
                <div style="font-size: 12px; opacity: 0.7; margin-top: 6px;">${escapeHTML(label)}</div>
            </div>
        `;

        const countFollowing = 10 + ((contact && contact.name ? contact.name.length : 3) * 7);
        const countFollowers = 3 + ((contact && contact.id ? String(contact.id).length : 2) * 2);
        const countLikes = 20 + ((memos.length + photos.length) * 3);

        const profileHTML = `
            <div style="border-radius: 18px; border: 1px solid var(--glass-border); background: var(--glass-bg); overflow: hidden;">
                <div style="height: 120px; ${coverStyle}"></div>
                <div style="padding: 14px;">
                    <div style="display:flex; gap: 12px; align-items: flex-end; margin-top: -38px;">
                        <div style="width: 76px; height: 76px; border-radius: 999px; border: 3px solid var(--glass-bg); background-image: url('${avatarUrl}'); background-size: cover; background-position: center;"></div>
                        <div style="flex:1; min-width: 0;">
                            <div style="font-weight: 900; font-size: 18px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(contact && contact.name ? contact.name : '未命名')}</div>
                            <div style="margin-top: 6px; font-size: 12px; opacity: 0.75;">No Introduction</div>
                        </div>
                        <div style="display:flex; gap: 8px; align-items:center;">
                            <button type="button" style="width: 40px; height: 40px; border-radius: 999px; border: 1px solid var(--glass-border); background: rgba(0,0,0,0.04); color: var(--text-color); cursor: pointer; display:flex; align-items:center; justify-content:center;">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 5v14m-7-7h14" /></svg>
                            </button>
                            <button type="button" style="width: 40px; height: 40px; border-radius: 999px; border: 1px solid var(--glass-border); background: rgba(0,0,0,0.04); color: var(--text-color); cursor: pointer; display:flex; align-items:center; justify-content:center;">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </button>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 14px;">
                        ${stat('Following', countFollowing)}
                        ${stat('Followers', countFollowers)}
                        ${stat('Likes', countLikes)}
                    </div>

                    ${galleryHTML}
                </div>
            </div>
        `;

        const actionBtn = (svg, label) => `
            <button type="button" style="flex: 1; border: none; background: transparent; color: var(--text-color); cursor: pointer; display:flex; align-items:center; justify-content:center; gap: 6px; padding: 10px 0; opacity: 0.85;">
                ${svg}
                <span style="font-size: 12px;">${escapeHTML(label)}</span>
            </button>
        `;

        const postCard = ({ title, imageColor, views, meta }) => `
            <div style="border-radius: 18px; border: 1px solid var(--glass-border); background: var(--glass-bg); overflow: hidden;">
                <div style="padding: 12px 14px; display:flex; gap: 10px; align-items:center;">
                    <div style="width: 34px; height: 34px; border-radius: 999px; background-image: url('${avatarUrl}'); background-size: cover; background-position: center;"></div>
                    <div style="min-width: 0; flex: 1;">
                        <div style="display:flex; gap: 10px; align-items: baseline; flex-wrap: wrap;">
                            <div style="font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px;">${escapeHTML(contact && contact.name ? contact.name : '我')}</div>
                            <div style="font-size: 12px; opacity: 0.7;">${escapeHTML(meta || '')}</div>
                        </div>
                    </div>
                    <button type="button" style="border:none; background: transparent; color: var(--text-color); opacity: 0.7; cursor:pointer; padding: 6px;">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
                    </button>
                </div>

                <div style="padding: 0 14px 12px; font-size: 18px; font-weight: 700; line-height: 1.35; word-break: break-word;">
                    ${escapeHTML(title)}
                </div>

                <div style="padding: 0 14px 12px; font-size: 12px; opacity: 0.7;">${escapeHTML(String(views))} Views</div>

                <div style="margin: 0 14px 12px; border-radius: 16px; border: 1px solid var(--glass-border); overflow: hidden; background: ${escapeHTML(imageColor || 'rgba(0,0,0,0.06)')}; aspect-ratio: 1.6;"></div>

                <div style="display:flex; border-top: 1px solid var(--glass-border);">
                    ${actionBtn('<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z\"></path></svg>', '赞')}
                    ${actionBtn('<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z\"></path></svg>', '评')}
                    ${actionBtn('<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7\"></path><polyline points=\"16 6 12 2 8 6\"></polyline><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"15\"></line></svg>', '转')}
                </div>
            </div>
        `;

        const posts = [];
        const nowMeta = 'yesterday 00:18  微博轻享版';

        if (memos.length) {
            memos.slice(-6).reverse().forEach((m, idx) => {
                const title = (m && m.title) ? m.title : (m && m.content ? m.content.slice(0, 24) : '一条微博');
                const imageColor = photos[idx] ? photos[idx].color : null;
                const views = 10 + Math.floor(Math.random() * 200);
                posts.push(postCard({ title, imageColor, views, meta: nowMeta }));
            });
        } else if (photos.length) {
            photos.slice(-6).reverse().forEach((p) => {
                posts.push(postCard({ title: '今天的小记录', imageColor: p.color, views: 10 + Math.floor(Math.random() * 200), meta: nowMeta }));
            });
        }

        const feedHTML = posts.length
            ? `<div style="display:flex; flex-direction: column; gap: 12px;">${posts.join('')}</div>`
            : `<div class="empty-text" style="padding: 30px 0; text-align:center;">暂无帖子<br><span style="font-size:12px; opacity:0.7">回到主屏双击灵动岛生成内容</span></div>`;

        const bodyHTML = `
            <div style="display:flex; flex-direction: column; gap: 12px;">
                ${profileHTML}
                ${feedHTML}
            </div>
        `;

        renderPhoneAppPage(contact, 'weibo', '微博', bodyHTML, { suppressDynamicIsland: true });
    }

    async function openMonitorView(contact) {
        const bodyEl = renderPhoneAppPage(contact, 'monitor', '监控', '<span class="empty-text">加载中...</span>', { suppressDynamicIsland: true });
        if (!bodyEl) return;

        let chatCount = 0;
        let summaryCount = 0;
        let phoneChats = 0;
        let phonePhotos = 0;
        let phoneMemos = 0;

        try {
            const chatAppDataRaw = await localforage.getItem('chatAppData');
            const chatAppData = chatAppDataRaw ? JSON.parse(chatAppDataRaw) : null;
            const msgs = (chatAppData && chatAppData.messages && chatAppData.messages[contact.id]) ? chatAppData.messages[contact.id] : [];
            chatCount = msgs.length;
            summaryCount = msgs.filter(m => m && m.type === 'summary').length;

            const phoneDataRaw = await localforage.getItem(`phone_data_${contact.id}`);
            const phoneData = phoneDataRaw ? JSON.parse(phoneDataRaw) : null;
            phoneChats = (phoneData && Array.isArray(phoneData.chats)) ? phoneData.chats.length : 0;
            phonePhotos = (phoneData && Array.isArray(phoneData.photos)) ? phoneData.photos.length : 0;
            phoneMemos = (phoneData && Array.isArray(phoneData.memos)) ? phoneData.memos.length : 0;
        } catch (_) {
        }

        bodyEl.innerHTML = `
            <div style="display: grid; gap: 12px;">
                <div style="padding: 14px; border-radius: 14px; border: 1px solid var(--glass-border); background: var(--glass-bg);">
                    <div style="font-size: 12px; opacity: 0.7;">联系人</div>
                    <div style="font-size: 18px; font-weight: 600; margin-top: 6px;">${escapeHTML(contact.name || '')}</div>
                </div>
                <div style="padding: 14px; border-radius: 14px; border: 1px solid var(--glass-border); background: var(--glass-bg); display: grid; gap: 8px;">
                    <div style="display: flex; justify-content: space-between;"><span style="opacity: 0.7;">聊天总条数</span><span style="font-weight: 600;">${chatCount}</span></div>
                    <div style="display: flex; justify-content: space-between;"><span style="opacity: 0.7;">总结条数</span><span style="font-weight: 600;">${summaryCount}</span></div>
                </div>
                <div style="padding: 14px; border-radius: 14px; border: 1px solid var(--glass-border); background: var(--glass-bg); display: grid; gap: 8px;">
                    <div style="display: flex; justify-content: space-between;"><span style="opacity: 0.7;">手机-聊天会话</span><span style="font-weight: 600;">${phoneChats}</span></div>
                    <div style="display: flex; justify-content: space-between;"><span style="opacity: 0.7;">手机-相册记录</span><span style="font-weight: 600;">${phonePhotos}</span></div>
                    <div style="display: flex; justify-content: space-between;"><span style="opacity: 0.7;">手机-备忘录</span><span style="font-weight: 600;">${phoneMemos}</span></div>
                </div>
            </div>
        `;
    }

    async function openPastView(contact) {
        const bodyEl = renderPhoneAppPage(contact, 'past', '往事', '<span class="empty-text">加载中...</span>', { suppressDynamicIsland: true });
        if (!bodyEl) return;

        let summaries = [];
        try {
            const chatAppDataRaw = await localforage.getItem('chatAppData');
            const chatAppData = chatAppDataRaw ? JSON.parse(chatAppDataRaw) : null;
            const msgs = (chatAppData && chatAppData.messages && chatAppData.messages[contact.id]) ? chatAppData.messages[contact.id] : [];
            summaries = msgs.filter(m => m && m.type === 'summary' && m.text).map(m => String(m.text));
        } catch (_) {
        }

        if (!summaries.length) {
            bodyEl.innerHTML = '<span class="empty-text">暂无总结内容</span>';
            return;
        }

        bodyEl.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 12px;">
                ${summaries.slice(-20).reverse().map(text => `
                    <div style="padding: 14px; border-radius: 14px; border: 1px solid var(--glass-border); background: var(--glass-bg); white-space: pre-wrap; word-break: break-word;">
                        ${escapeHTML(text)}
                    </div>
                `).join('')}
            </div>
        `;
    }

    async function openInstanceInPhoneView(contact) {
        const bodyEl = renderPhoneAppPage(contact, 'instance', '副本', '<span class="empty-text">加载中...</span>', { suppressDynamicIsland: true });
        if (!bodyEl) return;

        let instances = [];
        try {
            const data = await localforage.getItem('instanceData');
            instances = data ? JSON.parse(data) : [];
            if (!Array.isArray(instances)) instances = [];
        } catch (_) {
            instances = [];
        }

        if (!instances.length) {
            bodyEl.innerHTML = '<span class="empty-text">暂无副本</span>';
            return;
        }

        bodyEl.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 10px;">
                ${instances.map(inst => `
                    <div style="padding: 12px; border-radius: 14px; border: 1px solid var(--glass-border); background: var(--glass-bg);">
                        <div style="font-weight: 600;">${escapeHTML(inst.title || '未命名副本')}</div>
                        ${inst.intro ? `<div style="font-size: 12px; opacity: 0.7; margin-top: 6px; white-space: pre-wrap; word-break: break-word;">${escapeHTML(inst.intro)}</div>` : `<div style="font-size: 12px; opacity: 0.7; margin-top: 6px;">暂无简介</div>`}
                    </div>
                `).join('')}
            </div>
        `;
    }
// === 新增：日记App相关功能函数 ===
/**
 * 打开日记主界面
 * @param {object} contact - 当前查看的联系人对象
 */
async function openDiaryView(contact) {
    currentCheckPhoneView = 'diary'; // 更新视图状态

    // 清除背景图
    const phoneFrame = document.querySelector('.phone-simulator-frame');
    if (phoneFrame) phoneFrame.style.backgroundImage = 'none';

    const screenView = document.getElementById('phone-screen-view');
    if (!screenView) return;
    screenView.innerHTML = `
        <div class="diary-full-screen">
            <div class="diary-header">
                <button id="diary-back-btn" class="diary-header-btn">
                    <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                </button>
                <span class="title">日记</span>
                <button id="diary-generate-btn" class="diary-header-btn diary-generate-btn">
                    <svg t="1769857678247" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5844" width="24" height="24"><path d="M512 74.666667c214.229333 0 401.493333 159.274667 436.885333 368a32 32 0 0 1-39.317333 36.373333l-170.666667-42.666667a32 32 0 0 1 15.530667-62.08l119.402667 29.824c-48.106667-151.125333-191.829333-262.101333-354.432-265.386666L512 138.666667c-185.024 0-341.376 135.466667-369.024 316.458666a32 32 0 0 1-63.274667-9.664C112.128 233.322667 295.253333 74.666667 512 74.666667zM512 949.376c-214.208 0-401.493333-159.274667-436.864-368a32 32 0 0 1 42.773333-35.285333l170.666667 64a32 32 0 0 1-22.464 59.925333l-113.429333-42.538667 2.154666 6.165334c52.181333 144.042667 192.106667 248.490667 349.781334 251.669333l7.402666 0.064c183.04 0 338.261333-132.629333 368.170667-311.146667a32 32 0 0 1 63.125333 10.581334c-35.050667 209.237333-216.874667 364.586667-431.296 364.586666z" fill="#262626" p-id="5845"></path></svg>
                </button>
                <button id="diary-settings-btn" class="diary-header-btn">
                    <svg t="1769858052176" class="icon" viewBox="0 0 1084 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2277" width="24" height="24"><path d="M1072.147851 406.226367c-6.331285-33.456782-26.762037-55.073399-52.047135-55.073399-0.323417 0-0.651455 0.003081-0.830105 0.009241l-4.655674 0c-73.124722 0-132.618162-59.491899-132.618162-132.618162 0-23.731152 11.447443-50.336101 11.546009-50.565574 13.104573-29.498767 3.023185-65.672257-23.427755-84.127081l-1.601687-1.127342-134.400039-74.661726-1.700252-0.745401c-8.753836-3.805547-18.334698-5.735272-28.479231-5.735272-20.789593 0-41.235746 8.344174-54.683758 22.306575-14.741683 15.216028-65.622973 58.649474-104.721083 58.649474-39.450789 0-90.633935-44.286652-105.438762-59.784516-13.518857-14.247316-34.128258-22.753199-55.127302-22.753199-9.945862 0-19.354234 1.861961-27.958682 5.531982l-1.746455 0.74078-139.141957 76.431283-1.643269 1.139662c-26.537186 18.437884-36.675557 54.579032-23.584845 84.062398 0.115506 0.264895 11.579891 26.725075 11.579891 50.634877 0 73.126262-59.491899 132.618162-132.618162 132.618162l-4.581749 0c-0.318797-0.00616-0.636055-0.01078-0.951772-0.01078-25.260456 0-45.672728 21.618157-52.002472 55.0811-0.462025 2.453354-11.313456 60.622322-11.313456 106.117939 0 45.494078 10.85143 103.659965 11.314996 106.119479 6.334365 33.458322 26.758957 55.076479 52.036353 55.076479 0.320337 0 0.651455-0.00616 0.842426-0.012321l4.655674 0c73.126262 0 132.618162 59.491899 132.618162 132.616622 0 23.760413-11.444363 50.333021-11.546009 50.565574-13.093793 29.474125-3.041666 65.646075 23.395414 84.151722l1.569346 1.093459 131.838879 73.726895 1.675611 0.7377c8.750757 3.84251 18.305437 5.790715 28.397607 5.790715 21.082208 0 41.676209-8.706094 55.0888-23.290689 18.724339-20.347588 69.527086-62.362616 107.04815-62.362616 40.625872 0 92.72537 47.100385 107.759669 63.583903 13.441852 14.831008 34.176001 23.689571 55.470741 23.695731l0.00616 0c9.895039 0 19.27877-1.883523 27.893999-5.598205l1.711034-0.73924 136.659342-75.531873 1.617088-1.128882c26.492523-18.456365 36.601633-54.600594 23.538642-84.016195-0.115506-0.267974-11.595291-27.082374-11.595291-50.67646 0-73.124722 59.49344-132.616622 132.618162-132.616622l4.517066-0.00154c0.300316 0.00616 0.599092 0.009241 0.899409 0.009241 25.331299-0.00154 45.785153-21.619697 52.107197-55.054918 0.112426-0.589852 11.325776-59.507301 11.325776-106.14104C1083.464388 466.640776 1072.609877 408.67356 1072.147851 406.226367zM377.486862 945.656142l-115.32764-64.487932c5.082277-13.052211 15.437801-43.51815 15.437801-75.017486 0-109.382917-84.176364-199.816642-192.587488-208.134635-2.647404-15.427021-8.873963-54.967133-8.873963-85.667166 0-30.65691 6.223479-70.232445 8.869343-85.671786 108.415744-8.311832 192.592108-98.745557 192.592108-208.134635 0-31.416171-10.300081-61.797405-15.371577-74.854236l122.721583-67.40331c0.003081 0 0.00462 0.00154 0.007701 0.00154 4.423121 4.518606 22.121764 22.080182 46.558275 39.493911 39.929754 28.46229 77.952885 42.894416 113.014434 42.894416 34.716571 0 72.437845-14.151831 112.115025-42.06431 24.282503-17.07953 41.896442-34.302288 46.308782-38.74543 0.009241-0.00154 0.018481-0.00462 0.026182-0.00616l118.301542 65.726159c-5.077657 13.055291-15.416239 43.499669-15.416239 74.958962 0 109.389077 84.174824 199.822802 192.590568 208.134635 2.645865 15.462442 8.872423 55.107281 8.872423 85.671786 0 30.687711-6.223479 70.241685-8.869343 85.673326C890.042174 606.334084 805.86427 696.767809 805.86427 806.158426c0 31.450053 10.317022 61.851309 15.393138 74.903519l-119.783103 66.198965c-5.168521-5.490399-22.603811-23.363073-46.740005-41.288109-40.701336-30.224145-79.662378-45.549521-115.800446-45.549521-35.79155 0-74.458435 15.038919-114.927219 44.694774C400.22004 922.554885 382.666163 940.255068 377.486862 945.656142zM731.271848 511.646647c0-105.803762-86.081448-191.88059-191.888289-191.88059-105.803762 0-191.88059 86.076827-191.88059 191.88059 0 105.803762 86.076827 191.882129 191.88059 191.882129C645.19194 703.528777 731.271848 617.450409 731.271848 511.646647zM539.383558 395.903184c63.825696 0 115.751164 51.922387 115.751164 115.743463 0 63.825696-51.925468 115.751164-115.751164 115.751164-63.821076 0-115.743463-51.925468-115.743463-115.751164C423.640095 447.824031 475.562482 395.903184 539.383558 395.903184z" fill="#272636" p-id="2278"></path></svg>
                </button>
            </div>
            <div class="diary-body">
                <div id="diary-cards-container">
                    <span class="empty-text">点击刷新按钮生成第一篇日记</span>
                </div>
            </div>
            <!-- 新增：日记详情全屏视图容器 -->
            <div id="diary-detail-container" class="diary-detail-view">
                <div class="diary-detail-header" style="height: 40px; display: flex; align-items: center;">
                    <button id="diary-detail-back-btn" style="margin-top: 5px;">
                         <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                    </button>
                    <!-- 移除标题，将标题放入内容页面 -->
                </div>
                <div id="diary-detail-body" class="diary-detail-body">
                    <!-- 日记内容将填充至此，包括标题 -->
                </div>
                <!-- 新增：半屏编辑框 -->
                <div id="diary-edit-panel" class="diary-edit-panel">
                    <div class="diary-edit-toolbar">
                        <button id="diary-fullscreen-btn">
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>
                            全屏
                        </button>
                        <button id="diary-read-btn">
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                            朗读
                        </button>
                    </div>
                    <div class="diary-edit-content">
                        <!-- 背景设置 -->
                        <div class="diary-edit-section">
                            <h4>阅读背景</h4>
                            <div class="diary-background-options">
                                <button class="background-option" data-bg="">默认</button>
                                <button class="background-option" data-bg="纸张纹理.JPG">纸张纹理</button>
                                <button class="background-option" data-bg="木质纹理.jpg">木质纹理</button>
                                <button class="background-option" data-bg="custom">自定义</button>
                                <input type="file" id="diary-custom-bg-input" accept="image/*" style="display: none;">
                            </div>
                        </div>
                        <!-- 字体设置 -->
                        <div class="diary-edit-section">
                            <h4>字体</h4>
                            <select id="diary-font-select" class="diary-font-select">
                                <option value="">默认字体</option>
                            </select>
                            
                            <!-- 字体颜色和大小设置 -->
                            <div class="font-settings-container">
                                <!-- 字体颜色设置 -->
                                <div class="font-color-settings">
                                    <h5>字体颜色</h5>
                                    <div class="color-circles">
                                        <div class="color-circle" data-color="#000000" style="background-color: #000000; border: 2px solid #ddd;"></div>
                                        <div class="color-circle" data-color="#ffffff" style="background-color: #ffffff; border: 2px solid #ddd;"></div>
                                        <div class="color-circle custom-color-circle" data-color="custom" style="background-color: #333333; border: 2px solid #ddd;"></div>
                                        <div class="color-circle add-color-circle" style="background-color: rgba(255,255,255,0.5); border: 2px dashed #999;">
                                            <span style="color: #999; font-size: 16px; font-weight: bold;">+</span>
                                        </div>
                                    </div>
                                    <input type="color" id="diary-font-color-picker" style="display: none;">
                                </div>
                                
                                <!-- 字体大小设置 -->
                                <div class="font-size-settings">
                                    <h5>字体大小</h5>
                                    <div class="font-size-control">
                                        <button class="font-size-btn decrease-font-size">-</button>
                                        <div class="font-icon">Aa</div>
                                        <button class="font-size-btn increase-font-size">+</button>
                                    </div>
                                    
                                    <!-- 页边距调整设置 -->
                                    <div class="margin-settings">
                                        <h5>页边距</h5>
                                        <div class="margin-control">
                                            <button class="margin-btn decrease-margin">-</button>
                                            <div class="margin-icon">≡</div>
                                            <button class="margin-btn increase-margin">+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 新增：编辑框样式 -->
                <style>
                    .diary-edit-panel {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        height: 45%;
                        background: var(--glass-bg);
                        backdrop-filter: blur(12px);
                        border: 1px solid var(--glass-border);
                        border-radius: 20px 20px 0 0;
                        box-shadow: var(--glass-shadow);
                        transform: translateY(100%);
                        transition: transform 0.3s ease;
                        z-index: 1000;
                        display: flex;
                        flex-direction: column;
                    }
                    .diary-edit-panel.visible {
                        transform: translateY(0);
                    }
                    .diary-edit-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 15px 20px;
                        border-bottom: 1px solid #eee;
                    }
                    .diary-edit-header h3 {
                        margin: 0;
                        font-size: 16px;
                        font-weight: 600;
                    }
                    .diary-edit-header button {
                        background: none;
                        border: none;
                        cursor: pointer;
                        padding: 5px;
                    }
                    .diary-edit-content {
                        padding: 20px;
                        flex-grow: 1;
                        overflow-y: auto;
                        color: var(--text-color);
                    }
                    .diary-edit-section {
                        margin-bottom: 25px;
                    }
                    .diary-edit-section h4 {
                        margin: 0 0 15px 0;
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--text-color);
                    }
                    .diary-background-options {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 10px;
                    }
                    .background-option {
                        padding: 10px;
                        border: 1px solid var(--glass-border);
                        border-radius: 8px;
                        background: var(--glass-bg);
                        cursor: pointer;
                        font-size: 13px;
                        color: var(--text-color);
                        transition: all 0.2s ease;
                    }
                    .background-option:hover {
                        background-color: rgba(0, 0, 0, 0.05);
                    }
                    body.dark-mode .background-option:hover {
                        background-color: rgba(255, 255, 255, 0.08);
                    }
                    .background-option.active {
                        background-color: #e3f2fd;
                        border-color: #2196f3;
                    }
                    body.dark-mode .background-option.active {
                        background-color: rgba(33, 150, 243, 0.2);
                    }
                    .diary-font-select {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid var(--glass-border);
                        border-radius: 8px;
                        font-size: 13px;
                        background: var(--glass-bg);
                        color: var(--text-color);
                        margin-bottom: 15px;
                    }
                    
                    /* 字体设置容器 */
                    .font-settings-container {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        gap: 20px;
                    }
                    
                    /* 字体颜色设置 */
                    .font-color-settings {
                        flex: 1;
                    }
                    
                    .font-color-settings h5,
                    .font-size-settings h5 {
                        margin: 0 0 3px 0;
                        font-size: 13px;
                        font-weight: 500;
                        color: var(--text-color);
                    }
                    
                    /* 颜色圆圈容器 */
                    .color-circles {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 10px;
                    }
                    
                    /* 颜色圆圈 */
                    .color-circle {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                    }
                    
                    /* 颜色圆圈选中状态 */
                    .color-circle.active {
                        border-color: #2196f3;
                        box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.3);
                    }
                    
                    /* 字体大小设置 */
                    .font-size-settings {
                        flex: 1;
                    }
                    
                    /* 字体大小控制按钮 */
                    .font-size-control {
                        display: flex;
                        align-items: center;
                        background: var(--glass-bg);
                        border: 1px solid var(--glass-border);
                        border-radius: 20px;
                        overflow: hidden;
                    }
                    
                    /* 字体大小按钮 */
                    .font-size-btn {
                        flex: 1;
                        background: none;
                        border: none;
                        padding: 6px 10px;
                        font-size: 14px;
                        font-weight: bold;
                        cursor: pointer;
                        color: var(--text-color);
                        transition: background-color 0.2s ease;
                    }
                    
                    .font-size-btn:hover {
                        background-color: rgba(0, 0, 0, 0.05);
                    }
                    body.dark-mode .font-size-btn:hover {
                        background-color: rgba(255, 255, 255, 0.08);
                    }
                    
                    /* 字体图标 */
                    .font-icon {
                        flex: 1;
                        text-align: center;
                        padding: 6px 10px;
                        font-size: 12px;
                        font-weight: 500;
                        color: var(--text-color);
                        border-left: 1px solid var(--glass-border);
                        border-right: 1px solid var(--glass-border);
                    }
                    
                    /* 页边距设置 */
                    .margin-settings {
                        margin-top: 15px;
                    }
                    
                    /* 页边距控制按钮 */
                    .margin-control {
                        display: flex;
                        align-items: center;
                        background: var(--glass-bg);
                        border: 1px solid var(--glass-border);
                        border-radius: 20px;
                        overflow: hidden;
                    }
                    
                    /* 页边距按钮 */
                    .margin-btn {
                        flex: 1;
                        background: none;
                        border: none;
                        padding: 6px 10px;
                        font-size: 14px;
                        font-weight: bold;
                        cursor: pointer;
                        color: var(--text-color);
                        transition: background-color 0.2s ease;
                    }
                    
                    .margin-btn:hover {
                        background-color: rgba(0, 0, 0, 0.05);
                    }
                    body.dark-mode .margin-btn:hover {
                        background-color: rgba(255, 255, 255, 0.08);
                    }
                    
                    /* 页边距图标 */
                    .margin-icon {
                        flex: 1;
                        text-align: center;
                        padding: 6px 10px;
                        font-size: 12px;
                        font-weight: 500;
                        color: var(--text-color);
                        border-left: 1px solid var(--glass-border);
                        border-right: 1px solid var(--glass-border);
                    }
                    
                    /* 全屏和朗读按钮 */
                    .diary-edit-toolbar {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px 20px;
                        border-bottom: 1px solid var(--glass-border);
                    }
                    .diary-edit-toolbar button {
                        display: flex;
                        align-items: center;
                        gap: 5px;
                        padding: 8px 16px;
                        border: 1px solid var(--glass-border);
                        border-radius: 20px;
                        background: var(--glass-bg);
                        color: var(--text-color);
                        font-size: 13px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }
                    .diary-edit-toolbar button:hover {
                        background-color: rgba(0, 0, 0, 0.05);
                    }
                    body.dark-mode .diary-edit-toolbar button:hover {
                        background-color: rgba(255, 255, 255, 0.08);
                    }
                    
                    /* 全屏模式样式 */
                    .diary-full-screen.fullscreen {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 9999;
                        background: var(--bg-color-start);
                    }
                    .diary-full-screen.fullscreen .phone-simulator-frame {
                        display: none;
                    }
                </style>
            </div>
        </div>
    `;

    // 绑定新界面内的事件
    document.getElementById('diary-back-btn').addEventListener('click', () => {
        // 移除全屏模式
        const diaryFullScreen = document.querySelector('.diary-full-screen');
        diaryFullScreen.classList.remove('fullscreen');
        
        currentCheckPhoneView = 'simulator'; // 状态回退
        renderPhoneHomeScreen(contact);
    });
    
    // 全局变量用于存储请求控制器，用于取消API请求
    let abortController = null;
    
    document.getElementById('diary-generate-btn').addEventListener('click', () => {
        const generateBtn = document.getElementById('diary-generate-btn');
        if (generateBtn.classList.contains('generating')) {
            // 如果正在生成，则停止生成
            stopDiaryGeneration();
        } else {
            // 否则开始生成
            generateDiaryEntry(contact);
        }
    });
    
    /**
     * 停止日记生成过程
     */
    function stopDiaryGeneration() {
        const generateBtn = document.getElementById('diary-generate-btn');
        
        // 取消API请求
        if (abortController) {
            abortController.abort();
            abortController = null;
        }
        
        // 恢复按钮状态
        generateBtn.classList.remove('generating');
        generateBtn.disabled = false;
        
        // 显示停止提示
        showGlobalToast('生成已停止', {type: 'info'});
    }

    document.getElementById('diary-settings-btn').addEventListener('click', () => {
        openDiarySettings(contact);
    });

    // 新增：为日记卡片容器添加点击事件委托，用于打开详情页
    document.getElementById('diary-cards-container').addEventListener('click', async (e) => {
        const card = e.target.closest('.diary-card');
        if (!card) return;

        const diaryId = card.dataset.diaryId;
        const storageKey = `diary_entries_${contact.id}`;
        const diaries = JSON.parse(await localforage.getItem(storageKey)) || [];
        const selectedDiary = diaries.find(d => d.id === diaryId);

        if (selectedDiary) {
            openDiaryDetail(selectedDiary.title, selectedDiary.content, contact);
        }
    });

    // 详情页返回按钮
    document.getElementById('diary-detail-back-btn').addEventListener('click', () => {
        // 移除全屏模式
        const diaryFullScreen = document.querySelector('.diary-full-screen');
        diaryFullScreen.classList.remove('fullscreen');
        
        document.getElementById('diary-detail-container').classList.remove('visible');
    });

    // 全屏按钮事件
    document.getElementById('diary-fullscreen-btn').addEventListener('click', () => {
        const diaryFullScreen = document.querySelector('.diary-full-screen');
        diaryFullScreen.classList.toggle('fullscreen');
    });

    // 朗读按钮事件
    document.getElementById('diary-read-btn').addEventListener('click', () => {
        const diaryDetailBody = document.getElementById('diary-detail-body');
        if (diaryDetailBody) {
            const text = diaryDetailBody.textContent;
            if (text) {
                const speech = new SpeechSynthesisUtterance(text);
                speechSynthesis.speak(speech);
            }
        }
    });

    // 初始加载并渲染已存储的日记卡片
    await renderDiaryCards(contact.id);
}


/**
 * 打开日记设置悬浮窗
 * @param {object} contact - 当前联系人对象
 */
async function openDiarySettings(contact) {
    const storageKey = `diary_settings`;
    // 新的数据结构：selectedStyles 用于存储勾选的预设名称
    const settings = JSON.parse(await localforage.getItem(storageKey)) || { 
        apiPresetName: '', 
        activeWritingStyle: '', 
        writingStylePresets: {},
        selectedStyles: [] // 新增
    };

    const apiPresets = JSON.parse(await localforage.getItem('apiPresets')) || {};
    let apiOptionsHTML = '<option value="">默认(全局API设置)</option>';
    for (const presetName in apiPresets) {
        const isSelected = presetName === settings.apiPresetName;
        apiOptionsHTML += `<option value="${escapeHTML(presetName)}" ${isSelected ? 'selected' : ''}>${escapeHTML(presetName)}</option>`;
    }

    const overlay = document.createElement('div');
    overlay.id = 'diary-settings-overlay';
    // --- 按新要求重新组织HTML结构 ---
    overlay.innerHTML = `
        <div id="diary-settings-popover">
            <div class="diary-settings-section">
                <h5>API 预设</h5>
                <select id="diary-api-preset-select" class="modal-select">
                    ${apiOptionsHTML}
                </select>
            </div>
            
            
            <div class="diary-settings-section">
                <h5>文风预设</h5>
                <div id="diary-writing-style-selection-container" style="max-height: 40vh; overflow-y: auto; padding: 5px; background: rgba(0,0,0,0.03); border-radius: 8px;">
                    <!-- 新的可展开多选列表将由JS渲染到这里 -->
                </div>
            </div>
        </div>
    `;
    
    const screenView = document.getElementById('phone-screen-view');
    screenView.appendChild(overlay);

    // --- 新的文风选择逻辑 ---
    const styleContainer = document.getElementById('diary-writing-style-selection-container');
    const writingStyleData = JSON.parse(await localforage.getItem('writingStyleData')) || [];
    // 为了提高效率，使用 Set 存储已选中的 item ID
    const selectedItems = new Set(settings.selectedItems || []);

    const renderWritingStyleSelection = () => {
        if (writingStyleData.length === 0) {
            styleContainer.innerHTML = '<span class="empty-text" style="font-size: 12px; opacity: 0.7; text-align: center; display: block; padding: 10px;">请先在预设管理中添加文风</span>';
            return;
        }
        
        styleContainer.innerHTML = ''; // 清空容器
        writingStyleData.forEach(group => {
            const allItemIdsInGroup = group.items.map(item => item.id);
            const groupIsFullySelected = allItemIdsInGroup.every(id => selectedItems.has(id));
            const groupIsPartiallySelected = !groupIsFullySelected && allItemIdsInGroup.some(id => selectedItems.has(id));

            const details = document.createElement('details');
            details.innerHTML = `
                <summary style="display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 8px; list-style: none; user-select: none;">
                    <input type="checkbox" class="group-checkbox" data-group-id="${group.id}">
                    <span style="flex-grow: 1; font-weight: 500;">${escapeHTML(group.name)}</span>
                </summary>
                <div class="style-items-list" style="padding-left: 30px; display: flex; flex-direction: column; gap: 8px; margin-top: 5px; margin-bottom: 10px;">
                    ${group.items.map(item => `
                        <label class="preset-checkbox-item">
                            <input type="checkbox" class="item-checkbox" data-item-id="${item.id}" data-group-id="${group.id}" ${selectedItems.has(item.id) ? 'checked' : ''}>
                            <span>${escapeHTML(item.title)}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            
            const groupCheckbox = details.querySelector('.group-checkbox');
            groupCheckbox.checked = groupIsFullySelected;
            if (groupIsPartiallySelected) {
                groupCheckbox.indeterminate = true;
            }
            
            styleContainer.appendChild(details);
        });
    };

    renderWritingStyleSelection(); // 初始渲染

    // 保存设置的函数
    const saveDiarySettings = async () => {
        const currentSelected = new Set();
        styleContainer.querySelectorAll('.item-checkbox:checked').forEach(cb => {
            currentSelected.add(cb.dataset.itemId);
        });
        
        settings.apiPresetName = document.getElementById('diary-api-preset-select').value;
        settings.selectedItems = Array.from(currentSelected); // 将Set转回数组存储
        await localforage.setItem(storageKey, JSON.stringify(settings));
    };

    // 统一的事件监听
    document.getElementById('diary-api-preset-select').addEventListener('change', saveDiarySettings);
    styleContainer.addEventListener('change', (e) => {
        const target = e.target;
        if (target.type !== 'checkbox') return;

        // 联动逻辑
        if (target.classList.contains('group-checkbox')) {
            const groupId = target.dataset.groupId;
            const itemsInGroup = styleContainer.querySelectorAll(`.item-checkbox[data-group-id="${groupId}"]`);
            itemsInGroup.forEach(itemCheckbox => {
                itemCheckbox.checked = target.checked;
            });
        }

        // 更新所有组的半选/全选状态
        styleContainer.querySelectorAll('.group-checkbox').forEach(groupCb => {
            const groupId = groupCb.dataset.groupId;
            const itemsInGroup = Array.from(styleContainer.querySelectorAll(`.item-checkbox[data-group-id="${groupId}"]`));
            if (itemsInGroup.length > 0) {
                const checkedCount = itemsInGroup.filter(cb => cb.checked).length;
                
                if (checkedCount === 0) {
                    groupCb.checked = false;
                    groupCb.indeterminate = false;
                } else if (checkedCount === itemsInGroup.length) {
                    groupCb.checked = true;
                    groupCb.indeterminate = false;
                } else {
                    groupCb.checked = false;
                    groupCb.indeterminate = true;
                }
            }
        });
        
        // 保存更改
        saveDiarySettings();
    });

    overlay.addEventListener('click', (e) => {
        if (e.target.id === 'diary-settings-overlay') {
            screenView.removeChild(overlay);
        }
    });
    
    setTimeout(() => overlay.classList.add('visible'), 10);
}

/**
 * 新增：生成日记的核心函数
 * @param {object} contact - 当前联系人对象
 */
async function generateDiaryEntry(contact) {
    const generateBtn = document.getElementById('diary-generate-btn');
    if (generateBtn.classList.contains('generating')) return;

    generateBtn.classList.add('generating');
    generateBtn.disabled = true;

    try {
        // --- 1. 数据加载与校验 (核心修复 V2) ---
        // 直接从 localforage 加载数据，不再依赖外部函数
        const rawArchiveData = await localforage.getItem('archiveData');
        const rawChatData = await localforage.getItem('chatAppData');

        // 将加载的数据解析并挂载到 window 对象，供后续代码使用
        // 如果数据不存在，则初始化为空对象/数组结构，防止后续代码出错
        window.archiveData = rawArchiveData ? JSON.parse(rawArchiveData) : { user: {}, characters: [] };
        window.chatAppData = rawChatData ? JSON.parse(rawChatData) : { contacts: [], messages: {}, contactApiSettings: {} };
        
        // 理论上这里不会再抛出错误，但保留作为最终防线
        if (!window.archiveData || !window.chatAppData) {
            throw new Error("依赖的数据（档案或聊天数据）未能成功加载。");
        }
        
        // --- 2. 获取生成所需的所有数据 (原逻辑) ---
        const diarySettings = JSON.parse(await localforage.getItem(`diary_settings`)) || {};
        const apiPresets = JSON.parse(await localforage.getItem('apiPresets')) || {};
        let apiConfig = apiPresets[diarySettings.apiPresetName] || JSON.parse(await localforage.getItem('apiSettings')) || {};

        if (!apiConfig.url || !apiConfig.key || !apiConfig.model) {
            throw new Error('API配置不完整，请先在主界面的API设置中配置。');
        }

        const userPersona = window.archiveData.user.persona || '一个普通人';
        const char = window.archiveData.characters.find(c => c.id === contact.id);
        if (!char) throw new Error('找不到指定的角色信息。');
        
        // 现在可以安全地访问 window.chatAppData.messages 了
        const historyText = (window.chatAppData.messages[contact.id] || [])
            .slice(-100)
            .map(msg => `${msg.sender === 'me' ? (window.archiveData.user.name || 'User') : char.name}: ${msg.text}`)
            .join('\n');

        const writingStyleData = JSON.parse(await localforage.getItem('writingStyleData')) || [];
        const selectedItemIds = new Set(diarySettings.selectedItems || []);
        let finalWritingStyle = '';

        if (selectedItemIds.size > 0) {
            const selectedContents = [];
            writingStyleData.forEach(group => {
                group.items.forEach(item => {
                    if (selectedItemIds.has(item.id)) {
                        selectedContents.push(item.content);
                    }
                });
            });
            finalWritingStyle = selectedContents.join('\n\n');
        }
        
        const prompt = `
你现在是角色“${char.name}”，正在写一篇私密日记。
请根据以下信息，以“${char.name}”的第一人称视角，创作一篇日记。

【你的核心人设】:
${char.persona || '没有设定人设。'}

【你正在与之对话的人（User）的人设】:
${userPersona}

【最近的聊天记录回顾 (最近的100条)】:
${historyText || '（今天还没有聊天记录）'}

【日记的文风要求】:
${finalWritingStyle.trim() || '自然、口语化、符合人设'}

【输出要求】:
1.  第一行必须是日记的标题，标题要简洁且能概括日记核心内容。
2.  从第二行开始是日记正文。
3.  日记内容要真实反映你作为“${char.name}”的内心想法、情感波动，可以是对聊天内容的延续思考，也可以是对User的感受。
4.  请直接输出标题和正文，不要包含任何额外的解释、引言或署名。
`;
        
        // --- 3. 调用API ---
        // 创建 AbortController 实例
        abortController = new AbortController();
        const { signal } = abortController;
        
        // 此处应替换为你的真实API调用逻辑
        const response = await fetch(new URL('/v1/chat/completions', apiConfig.url).href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiConfig.key}`
            },
            body: JSON.stringify({
                model: apiConfig.model,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.9,
                stream: false
            }),
            signal // 传递取消信号
        });

        if (!response.ok) {
            throw new Error(`AI 服务请求失败: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        const aiResponse = result.choices[0].message.content;
        
        // --- 4. 处理返回结果并渲染 ---
        const lines = aiResponse.trim().split('\n');
        const title = lines.shift() || '无标题日记';
        const content = lines.join('\n');
        
        // 生成唯一ID
        const diaryId = Date.now().toString();
        
        // 创建日记对象 - 移除背景和背景颜色字段
        const diaryEntry = {
            id: diaryId,
            title: title,
            content: content,
            createdAt: new Date().toISOString()
        };
        
        // 持久化存储日记
        const storageKey = `diary_entries_${contact.id}`;
        const existingEntries = JSON.parse(await localforage.getItem(storageKey)) || [];
        existingEntries.unshift(diaryEntry);
        await localforage.setItem(storageKey, JSON.stringify(existingEntries));
        
        // 渲染日记卡片
        const cardContainer = document.getElementById('diary-cards-container');
        if (cardContainer.querySelector('.empty-text')) {
            cardContainer.innerHTML = '';
        }

        const card = document.createElement('div');
        card.className = 'diary-card';
        card.dataset.diaryId = diaryId;

        card.innerHTML = `<h2 class="diary-card-title">${escapeHTML(title)}</h2>`;
        
        cardContainer.prepend(card);
        showGlobalToast('日记已生成！', {type: 'success'});

    } catch (error) {
        // 处理请求被取消的情况
        if (error.name === 'AbortError') {
            console.log('生成已被用户取消');
            // 不显示错误提示，因为用户主动取消
            return;
        }
        
        console.error("生成日记失败:", error);
        showCustomAlert(`生成失败: ${error.message}`);
    } finally {
        // 清理 abortController
        abortController = null;
        
        // 恢复按钮状态
        generateBtn.classList.remove('generating');
        generateBtn.disabled = false;
    }
}
/**
 * 渲染日记卡片
 * @param {string} contactId - 联系人ID
 */
async function renderDiaryCards(contactId) {
    const storageKey = `diary_entries_${contactId}`;
    const diaries = JSON.parse(await localforage.getItem(storageKey)) || [];
    
    const cardContainer = document.getElementById('diary-cards-container');
    
    if (diaries.length === 0) {
        cardContainer.innerHTML = '<span class="empty-text">点击刷新按钮生成第一篇日记</span>';
        return;
    }
    
    cardContainer.innerHTML = '';
    
    diaries.forEach(diary => {
        const card = document.createElement('div');
        card.className = 'diary-card';
        card.dataset.diaryId = diary.id;
        
        card.innerHTML = `<h2 class="diary-card-title">${escapeHTML(diary.title)}</h2>`;
        
        cardContainer.appendChild(card);
    });
}

/**
 * 新增：打开日记详情页
 * @param {string} title - 日记标题
 * @param {string} content - 日记正文
 * @param {object} contact - 当前联系人对象
 */
async function openDiaryDetail(title, content, contact) {
    const detailContainer = document.getElementById('diary-detail-container');
    const detailBody = document.getElementById('diary-detail-body');
    const editPanel = document.getElementById('diary-edit-panel');
    
    if (!detailContainer || !detailBody) return;
    
    // 获取日记设置
    const storageKey = `diary_settings`;
    const settings = JSON.parse(await localforage.getItem(storageKey)) || {};
    
    // 应用背景图片
    if (settings.diaryBackground) {
        detailContainer.style.backgroundImage = `url('${settings.diaryBackground}')`;
        detailContainer.style.backgroundSize = 'cover';
        detailContainer.style.backgroundPosition = 'center';
        detailContainer.style.backgroundRepeat = 'no-repeat';
    } else {
        detailContainer.style.backgroundImage = '';
    }
    
    // 应用字体设置
    let fontFamily = '';
    if (settings.diaryFont) {
        fontFamily = settings.diaryFont;
        
        // 确保字体已加载
        if (!window.loadedChatFonts) {
            window.loadedChatFonts = new Set();
        }
        
        if (!window.loadedChatFonts.has(fontFamily)) {
            const fontPresets = JSON.parse(await localforage.getItem('fontPresets')) || {};
            const preset = fontPresets[fontFamily];
            
            if (preset && preset.fontUrl) {
                const styleId = `font-style-${fontFamily.replace(/\s+/g, '-')}`;
                if (!document.getElementById(styleId)) {
                    const style = document.createElement('style');
                    style.id = styleId;
                    style.textContent = `
                        @font-face {
                            font-family: '${fontFamily}';
                            src: url('${preset.fontUrl}');
                        }
                    `;
                    document.head.appendChild(style);
                }
                window.loadedChatFonts.add(fontFamily);
            }
        }
    }
    
    // 将标题放入内容页面中，字体变大且居中显示
    // 将内容按换行符分割，并包装在<p>标签中，使用正则为每段添加首行缩进
    const fontStyle = fontFamily ? `font-family: '${fontFamily}';` : '';
    detailBody.innerHTML = `<h1 style="font-size: 24px; text-align: center; margin-bottom: 20px; ${fontStyle}">${escapeHTML(title)}</h1>` + 
                          content.split('\n').map(p => {
                              // 为每段添加首行缩进样式
                              return `<p style="text-indent: 2em; ${fontStyle}">${escapeHTML(p)}</p>`;
                          }).join('');

    // 显示详情页
    detailContainer.classList.add('visible');
    
    // 为详情页添加点击事件监听器
    detailBody.addEventListener('click', function(e) {
        // 防止点击编辑框内容时触发
        if (!e.target.closest('.diary-edit-panel')) {
            if (editPanel.classList.contains('visible')) {
                editPanel.classList.remove('visible');
            } else {
                editPanel.classList.add('visible');
            }
        }
    });
    
    // 为编辑框关闭按钮添加点击事件
    const closeBtn = document.getElementById('diary-edit-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            editPanel.classList.remove('visible');
        });
    }
    
    // 加载字体预设到下拉框
    const fontSelect = document.getElementById('diary-font-select');
    if (fontSelect) {
        const fontPresets = JSON.parse(await localforage.getItem('fontPresets')) || {};
        fontSelect.innerHTML = '<option value="">默认字体</option>';
        
        for (const fontName in fontPresets) {
            const option = document.createElement('option');
            option.value = fontName;
            option.textContent = fontName;
            if (settings.diaryFont === fontName) {
                option.selected = true;
            }
            fontSelect.appendChild(option);
        }
        
        // 字体选择事件
        fontSelect.addEventListener('change', async function() {
            const selectedFont = this.value;
            settings.diaryFont = selectedFont;
            await localforage.setItem(storageKey, JSON.stringify(settings));
            
            // 直接更新字体样式，不再重新加载页面
            let fontFamily = '';
            if (selectedFont) {
                fontFamily = selectedFont;
                
                // 确保字体已加载
                if (!window.loadedChatFonts) {
                    window.loadedChatFonts = new Set();
                }
                
                if (!window.loadedChatFonts.has(fontFamily)) {
                    const fontPresets = JSON.parse(await localforage.getItem('fontPresets')) || {};
                    const preset = fontPresets[fontFamily];
                    
                    if (preset && preset.fontUrl) {
                        const styleId = `font-style-${fontFamily.replace(/\s+/g, '-')}`;
                        if (!document.getElementById(styleId)) {
                            const style = document.createElement('style');
                            style.id = styleId;
                            style.textContent = `
                                @font-face {
                                    font-family: '${fontFamily}';
                                    src: url('${preset.fontUrl}');
                                }
                            `;
                            document.head.appendChild(style);
                        }
                        window.loadedChatFonts.add(fontFamily);
                    }
                }
            }
            
            // 更新详情页中的字体样式
            const fontStyle = fontFamily ? `font-family: '${fontFamily}';` : '';
            detailBody.innerHTML = `<h1 style="font-size: 24px; text-align: center; margin-bottom: 20px; ${fontStyle}">${escapeHTML(title)}</h1>` + 
                                  content.split('\n').map(p => {
                                      // 为每段添加首行缩进样式
                                      return `<p style="text-indent: 2em; ${fontStyle}">${escapeHTML(p)}</p>`;
                                  }).join('');
        });
    }
    
    // 背景选项事件
    const backgroundOptions = document.querySelectorAll('.background-option');
    const customBgInput = document.getElementById('diary-custom-bg-input');
    
    backgroundOptions.forEach(option => {
        // 设置当前选中的背景
        if (option.dataset.bg === settings.diaryBackground || (option.dataset.bg === 'custom' && settings.diaryBackground && settings.diaryBackground.startsWith('data:'))) {
            option.classList.add('active');
        }
        
        option.addEventListener('click', async function() {
            const selectedBg = this.dataset.bg;
            
            if (selectedBg === 'custom') {
                // 触发文件选择器
                customBgInput.click();
            } else {
                settings.diaryBackground = selectedBg;
                await localforage.setItem(storageKey, JSON.stringify(settings));
                
                // 更新背景选项的选中状态
                backgroundOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // 应用新背景
                if (selectedBg) {
                    detailContainer.style.backgroundImage = `url('${selectedBg}')`;
                    detailContainer.style.backgroundSize = 'cover';
                    detailContainer.style.backgroundPosition = 'center';
                    detailContainer.style.backgroundRepeat = 'no-repeat';
                } else {
                    detailContainer.style.backgroundImage = '';
                }
            }
        });
    });
    
    // 自定义背景文件上传事件
    if (customBgInput) {
        customBgInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async function(event) {
                    const imageUrl = event.target.result;
                    settings.diaryBackground = imageUrl;
                    await localforage.setItem(storageKey, JSON.stringify(settings));
                    
                    // 更新背景选项的选中状态
                    backgroundOptions.forEach(opt => opt.classList.remove('active'));
                    document.querySelector('.background-option[data-bg="custom"]').classList.add('active');
                    
                    // 应用新背景
                    detailContainer.style.backgroundImage = `url('${imageUrl}')`;
                    detailContainer.style.backgroundSize = 'cover';
                    detailContainer.style.backgroundPosition = 'center';
                    detailContainer.style.backgroundRepeat = 'no-repeat';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // 字体颜色选择功能
    const colorCircles = document.querySelectorAll('.color-circle');
    const colorPicker = document.getElementById('diary-font-color-picker');
    const customColorCircle = document.querySelector('.custom-color-circle');
    
    if (colorCircles.length > 0) {
        // 加载保存的字体颜色设置
        const savedFontColor = settings.diaryFontColor || '#000000';
        
        // 设置初始选中的颜色圆圈
        colorCircles.forEach(circle => {
            if (circle.dataset.color === savedFontColor || (circle.dataset.color === 'custom' && savedFontColor !== '#000000' && savedFontColor !== '#ffffff')) {
                circle.classList.add('active');
                if (circle.dataset.color === 'custom') {
                    circle.style.backgroundColor = savedFontColor;
                }
            }
        });
        
        // 为颜色圆圈添加点击事件
        colorCircles.forEach(circle => {
            circle.addEventListener('click', async function() {
                const selectedColor = this.dataset.color;
                
                if (this.classList.contains('add-color-circle')) {
                    // 只有点击加号圈，才弹出颜色选择器
                    colorPicker.click();
                } else if (selectedColor === 'custom') {
                    // 点击自定义颜色圈，应用当前显示的颜色
                    const currentCustomColor = this.style.backgroundColor;
                    settings.diaryFontColor = currentCustomColor;
                    await localforage.setItem(storageKey, JSON.stringify(settings));
                    
                    // 更新颜色圆圈的选中状态
                    colorCircles.forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    
                    // 应用新的字体颜色
                    updateFontColor(currentCustomColor);
                } else {
                    // 点击其他颜色圈，直接选择颜色
                    settings.diaryFontColor = selectedColor;
                    await localforage.setItem(storageKey, JSON.stringify(settings));
                    
                    // 更新颜色圆圈的选中状态
                    colorCircles.forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    
                    // 应用新的字体颜色
                    updateFontColor(selectedColor);
                }
            });
        });
        
        // 为颜色选择器添加变化事件
        colorPicker.addEventListener('change', async function() {
            const selectedColor = this.value;
            settings.diaryFontColor = selectedColor;
            await localforage.setItem(storageKey, JSON.stringify(settings));
            
            // 更新自定义颜色圆圈的背景色
            customColorCircle.style.backgroundColor = selectedColor;
            
            // 更新颜色圆圈的选中状态
            colorCircles.forEach(c => c.classList.remove('active'));
            customColorCircle.classList.add('active');
            
            // 应用新的字体颜色
            updateFontColor(selectedColor);
        });
    }
    
    // 更新字体颜色的函数
    function updateFontColor(color) {
        const fontElements = detailBody.querySelectorAll('h1, p');
        fontElements.forEach(element => {
            element.style.color = color;
        });
    }
    
    // 字体大小调整功能
    const decreaseFontSizeBtn = document.querySelector('.decrease-font-size');
    const increaseFontSizeBtn = document.querySelector('.increase-font-size');
    
    if (decreaseFontSizeBtn && increaseFontSizeBtn) {
        // 加载保存的字体大小设置
        const savedFontSize = settings.diaryFontSize || 16;
        const savedTitleSize = settings.diaryTitleSize || 24;
        
        // 为减小字体按钮添加点击事件
        decreaseFontSizeBtn.addEventListener('click', async function() {
            let currentSize = parseInt(settings.diaryFontSize) || 16;
            let currentTitleSize = parseInt(settings.diaryTitleSize) || 24;
            
            // 减小字体大小（最小12px）
            if (currentSize > 12) {
                currentSize -= 2;
                currentTitleSize -= 3;
                
                settings.diaryFontSize = currentSize;
                settings.diaryTitleSize = currentTitleSize;
                await localforage.setItem(storageKey, JSON.stringify(settings));
                
                // 应用新的字体大小
                updateFontSize(currentSize, currentTitleSize);
            }
        });
        
        // 为增大字体按钮添加点击事件
        increaseFontSizeBtn.addEventListener('click', async function() {
            let currentSize = parseInt(settings.diaryFontSize) || 16;
            let currentTitleSize = parseInt(settings.diaryTitleSize) || 24;
            
            // 增大字体大小（最大24px）
            if (currentSize < 24) {
                currentSize += 2;
                currentTitleSize += 3;
                
                settings.diaryFontSize = currentSize;
                settings.diaryTitleSize = currentTitleSize;
                await localforage.setItem(storageKey, JSON.stringify(settings));
                
                // 应用新的字体大小
                updateFontSize(currentSize, currentTitleSize);
            }
        });
        
        // 初始应用保存的字体大小
        updateFontSize(savedFontSize, savedTitleSize);
    }
    
    // 更新字体大小的函数
    function updateFontSize(contentSize, titleSize) {
        const titleElement = detailBody.querySelector('h1');
        const contentElements = detailBody.querySelectorAll('p');
        
        if (titleElement) {
            titleElement.style.fontSize = `${titleSize}px`;
        }
        
        contentElements.forEach(element => {
            element.style.fontSize = `${contentSize}px`;
        });
    }
    
    // 页边距调整功能
    const decreaseMarginBtn = document.querySelector('.decrease-margin');
    const increaseMarginBtn = document.querySelector('.increase-margin');
    
    if (decreaseMarginBtn && increaseMarginBtn) {
        // 加载保存的页边距设置
        const savedMargin = settings.diaryMargin || 20;
        
        // 为减小页边距按钮添加点击事件
        decreaseMarginBtn.addEventListener('click', async function() {
            let currentMargin = parseInt(settings.diaryMargin) || 20;
            
            // 减小页边距（最小10px）
            if (currentMargin > 10) {
                currentMargin -= 2;
                settings.diaryMargin = currentMargin;
                await localforage.setItem(storageKey, JSON.stringify(settings));
                
                // 应用新的页边距
                updateMargin(currentMargin);
            }
        });
        
        // 为增大页边距按钮添加点击事件
        increaseMarginBtn.addEventListener('click', async function() {
            let currentMargin = parseInt(settings.diaryMargin) || 20;
            
            // 增大页边距（最大40px，确保内容不会超出手机模拟框）
            if (currentMargin < 40) {
                currentMargin += 2;
                settings.diaryMargin = currentMargin;
                await localforage.setItem(storageKey, JSON.stringify(settings));
                
                // 应用新的页边距
                updateMargin(currentMargin);
            }
        });
        
        // 初始应用保存的页边距
        updateMargin(savedMargin);
    }
    
    // 更新页边距的函数
    function updateMargin(margin) {
        detailBody.style.paddingLeft = `${margin}px`;
        detailBody.style.paddingRight = `${margin}px`;
    }
}

    // === 新增：监听外部打开日记的请求 ===
    // === 注入样式 ===
    const styleId = 'phone-app-extra-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .phone-app-header { display: flex; align-items: center; justify-content: space-between; padding: 10px; border-bottom: 1px solid var(--glass-border); height: 50px; flex-shrink: 0; }
            .phone-header-btn { background: none; border: none; padding: 5px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
            .phone-header-btn svg { width: 24px; height: 24px; fill: var(--text-color); }
            .phone-app-content { flex: 1; overflow-y: auto; position: relative; }
            
            /* Chat List */
            .phone-chat-list { display: flex; flex-direction: column; }
            .phone-chat-item { display: flex; align-items: center; padding: 12px; border-bottom: 1px solid var(--glass-border); cursor: pointer; transition: background 0.2s; }
            .phone-chat-item:active { background: rgba(0,0,0,0.05); }
            .phone-chat-avatar { width: 45px; height: 45px; border-radius: 8px; background-size: cover; background-position: center; margin-right: 12px; flex-shrink: 0; }
            .phone-chat-info { flex: 1; overflow: hidden; }
            .phone-chat-name { font-weight: bold; margin-bottom: 4px; font-size: 15px; }
            .phone-chat-preview { font-size: 13px; color: var(--text-color-secondary, #888); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

            /* Chat Detail */
            .phone-chat-detail-container { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 15px; background: rgba(0,0,0,0.02); }
            .phone-chat-msg-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 5px; }
            .row-right { flex-direction: row-reverse; }
            .msg-avatar { width: 36px; height: 36px; border-radius: 6px; background-size: cover; flex-shrink: 0; }
            .msg-bubble { padding: 10px 14px; border-radius: 8px; max-width: 75%; font-size: 15px; word-break: break-word; line-height: 1.4; position: relative; }
            .chat-bubble-left { background: #ffffff; color: #000; border: 1px solid rgba(0,0,0,0.05); }
            .chat-bubble-right { background: #95ec69; color: #000; border: 1px solid rgba(0,0,0,0.05); }
            .chat-divider { text-align: center; margin: 15px 0; position: relative; }
            .chat-divider span { background: var(--bg-color-start, #f5f5f5); padding: 0 10px; font-size: 12px; color: #999; position: relative; z-index: 1; }
            .chat-divider::after { content: ''; position: absolute; top: 50%; left: 10%; right: 10%; height: 1px; background: rgba(0,0,0,0.1); z-index: 0; }
            body.dark-mode .chat-bubble-left { background: #2c2c2c; color: #eee; border-color: #333; }
            body.dark-mode .chat-bubble-right { background: #2b5c2b; color: #eee; border-color: #1e401e; }
            body.dark-mode .chat-divider span { background: #1a1a1a; color: #666; }
            body.dark-mode .chat-divider::after { background: rgba(255,255,255,0.1); }

            /* Photos Grid - Refactored */
            .phone-photos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 15px; overflow-y: auto; flex: 1; align-content: start; }
            .phone-photo-item { aspect-ratio: 1; border-radius: 12px; cursor: pointer; transition: transform 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.05); position: relative; overflow: hidden; }
            .phone-photo-item:active { transform: scale(0.96); }

            /* Photo Detail Overlay - Refactored */
            .phone-photo-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.1); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); z-index: 100; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s; }
            body.dark-mode .phone-photo-overlay { background: rgba(0,0,0,0.2); }
            .photo-detail-card { width: 85%; max-height: 80%; background: transparent; border-radius: 0; box-shadow: none; display: flex; flex-direction: column; text-align: center; color: var(--text-color); overflow-y: auto; }
            .photo-desc { font-size: 18px; margin-bottom: 20px; line-height: 1.6; font-weight: 500; }
            .photo-divider { width: 40px; height: 2px; background: rgba(0,0,0,0.1); margin: 0 auto 20px; }
            body.dark-mode .photo-divider { background: rgba(255,255,255,0.2); }
            .photo-thoughts { font-style: italic; font-size: 15px; opacity: 0.7; font-family: "KaiTi", serif; }

            /* Memo List */
            .phone-memo-card { background: var(--glass-bg); padding: 15px; margin: 10px; border-radius: 10px; border: 1px solid var(--glass-border); cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
            .memo-title { font-weight: bold; margin-bottom: 8px; font-size: 17px; color: var(--text-color); }
            .memo-preview { font-size: 14px; color: var(--text-color-secondary, #666); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4; }

            /* Memo Detail */
            .phone-memo-detail-fullscreen { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: var(--bg-color-start); z-index: 50; display: flex; flex-direction: column; }
            .phone-memo-detail-content { padding: 25px; overflow-y: auto; flex: 1; }
            .phone-memo-detail-content h2 { margin-top: 0; margin-bottom: 20px; font-size: 22px; border-bottom: 1px solid var(--glass-border); padding-bottom: 10px; }
            .memo-full-text { font-size: 16px; line-height: 1.8; white-space: pre-wrap; color: var(--text-color); }
            
            /* Utils */
            .no-select { user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
            .long-press-menu { position: absolute; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 5px; z-index: 9999; animation: fadeIn 0.1s; }
            .long-press-item { padding: 8px 16px; font-size: 14px; color: #ff4d4f; cursor: pointer; border-radius: 4px; display: flex; align-items: center; gap: 8px; }
            .long-press-item:hover { background: rgba(255, 77, 79, 0.1); }
            
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `;
        document.head.appendChild(style);
    }
    
    // === 辅助函数：长按删除 ===
    function setupLongPressDelete(element, deleteCallback) {
        let pressTimer;
        const startPress = (e) => {
            // 如果是右键，不触发
            if (e.button === 2) return;
            
            pressTimer = setTimeout(() => {
                showDeleteMenu(e, deleteCallback);
            }, 600); // 600ms 长按触发
        };
        
        const cancelPress = () => {
            clearTimeout(pressTimer);
        };
        
        element.addEventListener('mousedown', startPress);
        element.addEventListener('touchstart', startPress, { passive: true });
        
        element.addEventListener('mouseup', cancelPress);
        element.addEventListener('mouseleave', cancelPress);
        element.addEventListener('touchend', cancelPress);
        element.addEventListener('touchmove', cancelPress);
        
        // 禁止默认右键菜单，方便PC端模拟长按习惯
        element.addEventListener('contextmenu', e => {
            e.preventDefault();
            showDeleteMenu(e, deleteCallback); // 右键直接触发
        });
        
        element.classList.add('no-select');
    }
    
    function showDeleteMenu(e, deleteCallback) {
        // 移除已有的菜单
        const existingMenu = document.querySelector('.long-press-menu');
        if (existingMenu) existingMenu.remove();
        
        const menu = document.createElement('div');
        menu.className = 'long-press-menu';
        menu.innerHTML = `
            <div class="long-press-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                删除
            </div>
        `;
        
        // 计算位置
        let x, y;
        if (e.type.startsWith('touch')) {
            // 对于 touchstart，通常没有 clientX/Y，需要从 touches 获取
            // 但因为我们是在 timer 里调用的，e 还是原来的 event
            // 注意：touchstart 触发时 event.touches[0] 可用
            const touch = e.touches ? e.touches[0] : e;
            x = touch.clientX;
            y = touch.clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }
        
        // 获取 phone-screen-view 的位置，确保菜单在屏幕内
        const screenView = document.getElementById('phone-screen-view');
        const rect = screenView.getBoundingClientRect();
        
        // 简单的边界处理
        if (x + 100 > rect.right) x = rect.right - 100;
        if (y + 50 > rect.bottom) y = rect.bottom - 50;
        
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        
        document.body.appendChild(menu);
        
        // 点击删除
        menu.querySelector('.long-press-item').addEventListener('click', (ev) => {
            ev.stopPropagation();
            deleteCallback();
            menu.remove();
        });
        
        // 点击其他地方关闭
        const closeMenu = (ev) => {
            if (!menu.contains(ev.target)) {
                menu.remove();
                document.removeEventListener('mousedown', closeMenu);
                document.removeEventListener('touchstart', closeMenu);
            }
        };
        
        // 延迟绑定，防止当前点击立即触发关闭
        setTimeout(() => {
            document.addEventListener('mousedown', closeMenu);
            document.addEventListener('touchstart', closeMenu);
        }, 10);
    }

    // === 新增：聊天APP功能 ===
    async function openChatView(contact) {
        currentCheckPhoneView = 'chat';
        setDynamicIslandSuppressed(true);

        // 清除背景图
        const phoneFrame = document.querySelector('.phone-simulator-frame');
        if (phoneFrame) phoneFrame.style.backgroundImage = 'none';

        const screenView = document.getElementById('phone-screen-view');
        if (!screenView) return;

        const storageKey = `phone_data_${contact.id}`;
        const phoneData = JSON.parse(await localforage.getItem(storageKey)) || { chats: [], photos: [], memos: [] };
        
        const renderListView = () => {
            const chats = phoneData.chats || [];
            let listHTML = `
                <div class="phone-app-header">
                    <button id="chat-back-btn" class="phone-header-btn">
                        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                    </button>
                    <span>聊天</span>
                    <div style="width:24px"></div>
                </div>
                <div class="phone-app-content">
            `;
            
            if (chats.length === 0) {
                listHTML += `<div class="empty-text" style="padding:40px 0; text-align:center; color:#888;">暂无消息<br><span style="font-size:12px; opacity:0.7">回到主屏双击灵动岛生成内容</span></div>`;
            } else {
                listHTML += `<div class="phone-chat-list">`;
                chats.forEach((chat, index) => {
                    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.avatar}`;
                    const lastMsg = chat.messages && chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : '';
                    
                    listHTML += `
                        <div class="phone-chat-item" data-index="${index}">
                            <div class="phone-chat-avatar" style="background-image: url('${avatarUrl}')"></div>
                            <div class="phone-chat-info">
                                <div class="phone-chat-name">${escapeHTML(chat.target)}</div>
                                <div class="phone-chat-preview">${escapeHTML(lastMsg)}</div>
                            </div>
                        </div>
                    `;
                });
                listHTML += `</div>`;
            }
            listHTML += `</div>`;
            
            screenView.innerHTML = listHTML;
            
            const backBtn = document.getElementById('chat-back-btn');
            if (backBtn) backBtn.addEventListener('click', () => {
                currentCheckPhoneView = 'simulator';
                setDynamicIslandSuppressed(false);
                renderPhoneHomeScreen(contact);
            });
            
            screenView.querySelectorAll('.phone-chat-item').forEach(item => {
                const index = parseInt(item.dataset.index);
                item.addEventListener('click', () => {
                    renderDetailView(chats[index]);
                });

                // 长按删除
                setupLongPressDelete(item, async () => {
                    phoneData.chats.splice(index, 1);
                    await localforage.setItem(storageKey, JSON.stringify(phoneData));
                    renderListView(); // 重新渲染列表
                    showGlobalToast('对话已删除', {type: 'success'});
                });
            });
        };

        const renderDetailView = (chat) => {
            let detailHTML = `
                <div class="phone-app-header">
                    <button id="chat-detail-back-btn" class="phone-header-btn">
                        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                    </button>
                    <span>${escapeHTML(chat.target)}</span>
                    <div style="width:24px"></div>
                </div>
                <div class="phone-chat-detail-container">
            `;
            
            chat.messages.forEach(msg => {
                if (msg.type === 'divider') {
                    detailHTML += `
                        <div class="chat-divider">
                            <span>${escapeHTML(msg.text)}</span>
                        </div>
                    `;
                    return;
                }

                const isMe = msg.sender.toLowerCase() === 'me';
                const bubbleClass = isMe ? 'chat-bubble-right' : 'chat-bubble-left';
                const avatar = isMe ? contact.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.avatar}`;
                
                detailHTML += `
                    <div class="phone-chat-msg-row ${isMe ? 'row-right' : ''}">
                        <div class="msg-avatar" style="background-image: url('${avatar}')"></div>
                        <div class="msg-bubble ${bubbleClass}">
                            ${escapeHTML(msg.text)}
                        </div>
                    </div>
                `;
            });
            
            detailHTML += `</div>`;
            screenView.innerHTML = detailHTML;
            
            const backBtn = document.getElementById('chat-detail-back-btn');
            if(backBtn) backBtn.addEventListener('click', renderListView);
        };
        
        renderListView();
    }

    // === 新增：相册APP功能 ===
    async function openPhotosView(contact) {
        currentCheckPhoneView = 'photos';
        setDynamicIslandSuppressed(true);

        // 清除背景图
        const phoneFrame = document.querySelector('.phone-simulator-frame');
        if (phoneFrame) phoneFrame.style.backgroundImage = 'none';

        const screenView = document.getElementById('phone-screen-view');
        if (!screenView) return;

        const storageKey = `phone_data_${contact.id}`;
        const phoneData = JSON.parse(await localforage.getItem(storageKey)) || { chats: [], photos: [], memos: [] };
        
        const renderGridView = () => {
            const photos = phoneData.photos || [];
            let gridHTML = `
                <div class="phone-app-header">
                    <button id="photos-back-btn" class="phone-header-btn">
                        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                    </button>
                    <span>相册</span>
                    <div style="width:24px"></div>
                </div>
                <div class="phone-photos-grid">
            `;
            
            if (photos.length === 0) {
                gridHTML += `<div class="empty-text" style="width:100%;text-align:center;padding-top:50px;color:#888;">暂无照片<br><span style="font-size:12px; opacity:0.7">回到主屏双击灵动岛生成内容</span></div>`;
            } else {
                photos.forEach((photo, index) => {
                    // 使用 color 字段，如果没有则随机分配一个颜色
                    const bgColor = photo.color || '#e0e0e0';
                    gridHTML += `
                        <div class="phone-photo-item" data-index="${index}" style="background-color: ${bgColor}"></div>
                    `;
                });
            }
            gridHTML += `</div>`;
            
            screenView.innerHTML = gridHTML;
            
            const backBtn = document.getElementById('photos-back-btn');
            if (backBtn) backBtn.addEventListener('click', () => {
                currentCheckPhoneView = 'simulator';
                setDynamicIslandSuppressed(false);
                renderPhoneHomeScreen(contact);
            });
            
            screenView.querySelectorAll('.phone-photo-item').forEach(item => {
                const index = parseInt(item.dataset.index);
                
                // 点击查看详情
                item.addEventListener('click', () => {
                    showPhotoDetail(photos[index]);
                });
                
                // 长按删除
                setupLongPressDelete(item, async () => {
                    phoneData.photos.splice(index, 1);
                    await localforage.setItem(storageKey, JSON.stringify(phoneData));
                    renderGridView(); // 重新渲染
                    showGlobalToast('照片已删除', {type: 'success'});
                });
            });
        };
        
        const showPhotoDetail = (photo) => {
            const overlay = document.createElement('div');
            overlay.className = 'phone-photo-overlay';
            overlay.innerHTML = `
                <div class="photo-detail-card">
                    <div class="photo-detail-text">
                        <div class="photo-desc">${escapeHTML(photo.description)}</div>
                        <div class="photo-divider"></div>
                        <div class="photo-thoughts">${escapeHTML(photo.thoughts)}</div>
                    </div>
                </div>
            `;
            
            overlay.addEventListener('click', () => {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            });
            
            screenView.appendChild(overlay);
        };
        
        renderGridView();
    }

    // === 新增：备忘录APP功能 ===
    async function openMemoView(contact) {
        currentCheckPhoneView = 'memo';
        setDynamicIslandSuppressed(true);

        // 清除背景图
        const phoneFrame = document.querySelector('.phone-simulator-frame');
        if (phoneFrame) phoneFrame.style.backgroundImage = 'none';

        const screenView = document.getElementById('phone-screen-view');
        if (!screenView) return;

        const storageKey = `phone_data_${contact.id}`;
        const phoneData = JSON.parse(await localforage.getItem(storageKey)) || { chats: [], photos: [], memos: [] };
        
        const renderMemoList = () => {
            const memos = phoneData.memos || [];
            let html = `
                <div class="phone-app-header">
                    <button id="memo-back-btn" class="phone-header-btn">
                        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                    </button>
                    <span>备忘录</span>
                    <div style="width:24px"></div>
                </div>
                <div class="phone-app-content" style="padding: 10px;">
            `;
            
            if (memos.length === 0) {
                html += `<div class="empty-text" style="padding:40px 0; text-align:center; color:#888;">暂无备忘<br><span style="font-size:12px; opacity:0.7">回到主屏双击灵动岛生成内容</span></div>`;
            } else {
                memos.forEach((memo, index) => {
                    html += `
                        <div class="phone-memo-card" data-index="${index}">
                            <div class="memo-title">${escapeHTML(memo.title)}</div>
                            <div class="memo-preview">${escapeHTML(memo.content)}</div>
                        </div>
                    `;
                });
            }
            html += `</div>`;
            
            screenView.innerHTML = html;
            
            const backBtn = document.getElementById('memo-back-btn');
            if (backBtn) backBtn.addEventListener('click', () => {
                currentCheckPhoneView = 'simulator';
                setDynamicIslandSuppressed(false);
                renderPhoneHomeScreen(contact);
            });
            
            screenView.querySelectorAll('.phone-memo-card').forEach(item => {
                const index = parseInt(item.dataset.index);
                item.addEventListener('click', () => {
                    showMemoDetail(memos[index]);
                });

                // 长按删除
                setupLongPressDelete(item, async () => {
                    phoneData.memos.splice(index, 1);
                    await localforage.setItem(storageKey, JSON.stringify(phoneData));
                    renderMemoList(); // 重新渲染列表
                    showGlobalToast('备忘录已删除', {type: 'success'});
                });
            });
        };
        
        const showMemoDetail = (memo) => {
            let detailHTML = `
                <div class="phone-memo-detail-fullscreen">
                    <div class="phone-app-header">
                        <button id="memo-detail-back-btn" class="phone-header-btn">
                            <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                        </button>
                        <span>详情</span>
                        <div style="width:24px"></div>
                    </div>
                    <div class="phone-memo-detail-content">
                        <h2>${escapeHTML(memo.title)}</h2>
                        <div class="memo-full-text">${escapeHTML(memo.content).replace(/\n/g, '<br>')}</div>
                    </div>
                </div>
            `;
            
            const overlay = document.createElement('div');
            overlay.innerHTML = detailHTML;
            const detailView = overlay.firstElementChild;
            screenView.appendChild(detailView);
            
            const backBtn = detailView.querySelector('#memo-detail-back-btn');
            if (backBtn) backBtn.addEventListener('click', () => {
                if (detailView.parentNode) detailView.parentNode.removeChild(detailView);
            });
        };
        
        renderMemoList();
    }

    // === 新增：生成手机内容逻辑 ===
    async function generatePhoneContent(contact) {
        const dynamicIsland = document.querySelector('.phone-dynamic-island');
        if (dynamicIsland) {
            dynamicIsland.textContent = '生成中...';
            dynamicIsland.style.width = '120px';
            dynamicIsland.style.color = '#fff';
            dynamicIsland.style.display = isDynamicIslandSuppressed ? 'none' : 'flex';
            dynamicIsland.style.alignItems = 'center';
            dynamicIsland.style.justifyContent = 'center';
            dynamicIsland.style.fontSize = '12px';
        }
        
        try {
            // 1. 准备上下文
            if (!window.archiveData) window.archiveData = JSON.parse(await localforage.getItem('archiveData'));
            if (!window.chatAppData) window.chatAppData = JSON.parse(await localforage.getItem('chatAppData'));
            
            const userPersona = (window.archiveData.user && window.archiveData.user.persona) ? window.archiveData.user.persona : '普通用户';
            const charPersona = contact.persona || '无设定';
            const msgs = (window.chatAppData.messages[contact.id] || []).slice(-100);
            const historyText = msgs.map(m => `${m.sender==='me'?'User':contact.name}: ${m.text}`).join('\n');
            
            // 获取工具栏总结
            const summaryMsg = (window.chatAppData.messages[contact.id] || [])
                .filter(m => m.type === 'summary')
                .pop();
            const summaryText = summaryMsg ? summaryMsg.text : '暂无总结';

            const storageKey = `phone_data_${contact.id}`;
            const existingPhoneDataRaw = await localforage.getItem(storageKey);
            const existingPhoneData = existingPhoneDataRaw ? JSON.parse(existingPhoneDataRaw) : null;
            const existingWalletBalance = (existingPhoneData && existingPhoneData.wallet && typeof existingPhoneData.wallet.balance === 'number')
                ? existingPhoneData.wallet.balance
                : null;
            
            const prompt = `
你现在是角色“${contact.name}”。请根据你的人设、User的人设以及最近的聊天记录，生成你手机里可能存在的内容。
请包含以下六部分内容，并严格按照指定格式输出：

1. **聊天列表 (Chat)**：
   生成2-3个与其他人的聊天记录（不要生成和User的，句末不加句号）。
   格式：
   [CHAT]
   Target: 对方名字
   Avatar: 英文单词(作为随机种子)
   Content:
   [Them]: 对方说的话
   [Me]: 我说的话
   ...
   [/CHAT]

2. **相册 (Photo)**：
   生成2-3张照片记录（请使用英文单词作为Image种子）。
   格式：
   [PHOTO]
   Image: 英文单词(作为随机种子)
   Description: 照片描述
   Thoughts: 拍摄时的想法
   [/PHOTO]

3. **备忘录 (Memo)**：
   生成2-3条备忘录。
   格式：
   [MEMO]
   Title: 标题
   Content: 内容
   [/MEMO]

4. **浏览器 (Browser)**：
   生成8-15条“搜索记录”，贴合角色人设（求助、找教程、找资源、情绪宣泄等都可以），语气像真实搜索词，尽量短。
   格式：
   [BROWSER]
   [SEARCH]
   Query: 搜索词
   Time: 时间(如 23:41)
   Intent: 搜索动机(可选，一句话)
   [/SEARCH]
   ...
   [/BROWSER]

5. **钱包 (Wallet)**：
   只生成账单收支条目，并用条目去动态更新余额。
   ${existingWalletBalance === null ? '首次生成：需要给出 InitialBalance（准确数字，保留两位小数）。' : `当前余额已存在：${existingWalletBalance.toFixed(2)}，不要生成 InitialBalance。`}
   格式：
   [WALLET]
   InitialBalance: 数字(仅在首次生成时出现，保留两位小数)
   [BILL]
   Type: income|expense
   Amount: 金额(正数，保留两位小数)
   Time: 时间(如 02-14 13:20 或 13:20)
   Title: 标题(简短)
   Note: 备注(可选)
   [/BILL]
   ...
   [/WALLET]

6. **健康 (Health)**：
   生成一个健康面板的四个模块：睡眠、运动、压力、饮食。卡片摘要用在主界面；点击后展示详情。
   格式：
   [HEALTH]
   [SLEEP]
   Duration: 睡眠时长(如 7h32m)
   Start: 开始时间(如 23:41)
   End: 结束时间(如 07:13)
   Awake: 清醒时长|占比(如 0h28m|6)
   REM: 快速眼动时长|占比
   Core: 核心睡眠时长|占比
   Deep: 深度睡眠时长|占比
   [/SLEEP]
   [EXERCISE]
   Duration: 运动时长(如 48m)
   [ACTIVITY]
   Name: 项目名
   Time: 开始-结束(如 18:30-19:10)
   Calories: 数字(如 260)
   [/ACTIVITY]
   ...
   [/EXERCISE]
   [STRESS]
   Summary: 词语(如 活力满满/压力较大)
   [POINT]
   Time: 时间(如 09:00)
   Value: 0-100
   [/POINT]
   ...
   [REASON]
   Time: 时间段或时间点(如 14:00-16:00)
   Reason: 压力原因(一句话)
   [/REASON]
   ...
   [/STRESS]
   [DIET]
   Score: 0-100
   [MEAL]
   Time: 时间(如 08:10)
   Content: 吃了什么(一句或多项)
   [/MEAL]
   ...
   [/DIET]
   [/HEALTH]

---
**上下文参考**：
【你的人设】：${charPersona}
【User人设】：${userPersona}
【最近聊天】：
${historyText}
【剧情总结】：
${summaryText}
`;

            // 2. 调用API
            const apiPresets = JSON.parse(await localforage.getItem('apiPresets')) || {};
            const diarySettings = JSON.parse(await localforage.getItem(`diary_settings`)) || {};
            const apiConfig = apiPresets[diarySettings.apiPresetName] || JSON.parse(await localforage.getItem('apiSettings')) || {};
            
            if (!apiConfig.url || !apiConfig.key) throw new Error('API未配置，请先在日记设置或主界面配置API');
            
            const response = await fetch(new URL('/v1/chat/completions', apiConfig.url).href, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiConfig.key}`
                },
                body: JSON.stringify({
                    model: apiConfig.model,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.8
                })
            });
            
            if (!response.ok) throw new Error('API请求失败: ' + response.status);
            
            const result = await response.json();
            const content = result.choices[0].message.content;
            
            // 3. 解析结果
            const newChats = [];
            const chatRegex = /\[CHAT\]\s*Target:\s*(.*?)\s*Avatar:\s*(.*?)\s*Content:\s*([\s\S]*?)\[\/CHAT\]/gi;
            let chatMatch;
            while ((chatMatch = chatRegex.exec(content)) !== null) {
                const msgs = [];
                const msgRegex = /\[(Them|Me)\]:\s*(.*)/gi;
                let msgMatch;
                const rawContent = chatMatch[3];
                while ((msgMatch = msgRegex.exec(rawContent)) !== null) {
                    msgs.push({ sender: msgMatch[1], text: msgMatch[2].trim() });
                }
                newChats.push({
                    target: chatMatch[1].trim(),
                    avatar: chatMatch[2].trim(),
                    messages: msgs
                });
            }
            
            const newPhotos = [];
            const photoRegex = /\[PHOTO\]\s*Image:\s*(.*?)\s*Description:\s*(.*?)\s*Thoughts:\s*(.*?)\s*\[\/PHOTO\]/gi;
            let photoMatch;
            const colors = ['#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#ACBED8', '#E8D3D1', '#9FA199', '#D9CD90', '#E9E7DA', '#B2A59F'];
            while ((photoMatch = photoRegex.exec(content)) !== null) {
                // 随机选择颜色
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                newPhotos.push({
                    image: photoMatch[1].trim(),
                    description: photoMatch[2].trim(),
                    thoughts: photoMatch[3].trim(),
                    color: randomColor
                });
            }
            
            const newMemos = [];
            const memoRegex = /\[MEMO\]\s*Title:\s*(.*?)\s*Content:\s*([\s\S]*?)\[\/MEMO\]/gi;
            let memoMatch;
            while ((memoMatch = memoRegex.exec(content)) !== null) {
                newMemos.push({
                    title: memoMatch[1].trim(),
                    content: memoMatch[2].trim()
                });
            }

            const newSearches = [];
            const browserBlockMatch = content.match(/\[BROWSER\]([\s\S]*?)\[\/BROWSER\]/i);
            if (browserBlockMatch) {
                const searchRegex = /\[SEARCH\]\s*Query:\s*(.*?)\s*(?:Time:\s*(.*?)\s*)?(?:Intent:\s*(.*?)\s*)?\[\/SEARCH\]/gi;
                let searchMatch;
                while ((searchMatch = searchRegex.exec(browserBlockMatch[1])) !== null) {
                    const query = (searchMatch[1] || '').trim();
                    const time = (searchMatch[2] || '').trim();
                    const intent = (searchMatch[3] || '').trim();
                    if (!query) continue;
                    newSearches.push({ query, time, intent });
                }
            }

            const walletBlockMatch = content.match(/\[WALLET\]([\s\S]*?)\[\/WALLET\]/i);
            const walletInitialBalanceMatch = walletBlockMatch ? walletBlockMatch[1].match(/InitialBalance:\s*([0-9]+(?:\.[0-9]+)?)/i) : null;
            const walletInitialBalance = walletInitialBalanceMatch ? Number(walletInitialBalanceMatch[1]) : null;

            const newBills = [];
            if (walletBlockMatch) {
                const billRegex = /\[BILL\]\s*Type:\s*(income|expense)\s*Amount:\s*([0-9]+(?:\.[0-9]+)?)\s*Time:\s*(.*?)\s*Title:\s*(.*?)\s*(?:Note:\s*(.*?)\s*)?\[\/BILL\]/gi;
                let billMatch;
                while ((billMatch = billRegex.exec(walletBlockMatch[1])) !== null) {
                    const type = (billMatch[1] || '').trim();
                    const amount = Number(billMatch[2]);
                    const time = (billMatch[3] || '').trim();
                    const title = (billMatch[4] || '').trim();
                    const note = (billMatch[5] || '').trim();
                    if (!type || !Number.isFinite(amount) || amount <= 0 || !title) continue;
                    newBills.push({ type, amount: Number(amount.toFixed(2)), time, title, note });
                }
            }

            const healthBlockMatch = content.match(/\[HEALTH\]([\s\S]*?)\[\/HEALTH\]/i);
            const parseTaggedBlock = (src, tag) => {
                const m = src.match(new RegExp(`\\[${tag}\\]([\\s\\S]*?)\\[\\/${tag}\\]`, 'i'));
                return m ? m[1] : '';
            };

            const parsedHealth = (() => {
                if (!healthBlockMatch) return null;
                const raw = healthBlockMatch[1];

                const sleepRaw = parseTaggedBlock(raw, 'SLEEP');
                const exerciseRaw = parseTaggedBlock(raw, 'EXERCISE');
                const stressRaw = parseTaggedBlock(raw, 'STRESS');
                const dietRaw = parseTaggedBlock(raw, 'DIET');

                const readLineValue = (block, key) => {
                    const m = block.match(new RegExp(`${key}:\\s*(.*)`, 'i'));
                    return m ? (m[1] || '').trim() : '';
                };

                const sleep = sleepRaw ? {
                    duration: readLineValue(sleepRaw, 'Duration'),
                    start: readLineValue(sleepRaw, 'Start'),
                    end: readLineValue(sleepRaw, 'End'),
                    awake: readLineValue(sleepRaw, 'Awake'),
                    rem: readLineValue(sleepRaw, 'REM'),
                    core: readLineValue(sleepRaw, 'Core'),
                    deep: readLineValue(sleepRaw, 'Deep')
                } : null;

                const exerciseActivities = [];
                if (exerciseRaw) {
                    const activityRegex = /\[ACTIVITY\]\s*Name:\s*(.*?)\s*Time:\s*(.*?)\s*Calories:\s*([0-9]+(?:\.[0-9]+)?)\s*\[\/ACTIVITY\]/gi;
                    let activityMatch;
                    while ((activityMatch = activityRegex.exec(exerciseRaw)) !== null) {
                        const name = (activityMatch[1] || '').trim();
                        const time = (activityMatch[2] || '').trim();
                        const calories = Number(activityMatch[3]);
                        if (!name) continue;
                        exerciseActivities.push({ name, time, calories: Number.isFinite(calories) ? calories : null });
                    }
                }
                const exercise = exerciseRaw ? {
                    duration: readLineValue(exerciseRaw, 'Duration'),
                    activities: exerciseActivities
                } : null;

                const stressPoints = [];
                const stressReasons = [];
                if (stressRaw) {
                    const pointRegex = /\[POINT\]\s*Time:\s*(.*?)\s*Value:\s*([0-9]+(?:\.[0-9]+)?)\s*\[\/POINT\]/gi;
                    let pointMatch;
                    while ((pointMatch = pointRegex.exec(stressRaw)) !== null) {
                        const time = (pointMatch[1] || '').trim();
                        const value = Number(pointMatch[2]);
                        if (!Number.isFinite(value)) continue;
                        stressPoints.push({ time, value: Math.max(0, Math.min(100, value)) });
                    }

                    const reasonRegex = /\[REASON\]\s*Time:\s*(.*?)\s*Reason:\s*([\s\S]*?)\s*\[\/REASON\]/gi;
                    let reasonMatch;
                    while ((reasonMatch = reasonRegex.exec(stressRaw)) !== null) {
                        const time = (reasonMatch[1] || '').trim();
                        const reason = (reasonMatch[2] || '').trim();
                        if (!reason) continue;
                        stressReasons.push({ time, reason });
                    }
                }
                const stress = stressRaw ? {
                    summary: readLineValue(stressRaw, 'Summary'),
                    points: stressPoints,
                    reasons: stressReasons
                } : null;

                const dietMeals = [];
                if (dietRaw) {
                    const mealRegex = /\[MEAL\]\s*Time:\s*(.*?)\s*Content:\s*([\s\S]*?)\s*\[\/MEAL\]/gi;
                    let mealMatch;
                    while ((mealMatch = mealRegex.exec(dietRaw)) !== null) {
                        const time = (mealMatch[1] || '').trim();
                        const contentText = (mealMatch[2] || '').trim();
                        if (!contentText) continue;
                        dietMeals.push({ time, content: contentText });
                    }
                }
                const scoreRaw = dietRaw ? readLineValue(dietRaw, 'Score') : '';
                const scoreNum = scoreRaw ? Number(scoreRaw) : null;
                const diet = dietRaw ? {
                    score: Number.isFinite(scoreNum) ? Math.max(0, Math.min(100, scoreNum)) : null,
                    meals: dietMeals
                } : null;

                return { sleep, exercise, stress, diet };
            })();
            
            // 4. 保存数据 (增量更新)
            const oldData = existingPhoneData || { chats: [], photos: [], memos: [], browser: { searches: [] }, wallet: { balance: null, bills: [] }, health: null };
            
            // 合并聊天
            const mergedChats = [...oldData.chats];
            newChats.forEach(newChat => {
                const existingChat = mergedChats.find(c => c.target === newChat.target);
                if (existingChat) {
                    // 如果存在，添加分界线和新消息
                    if (newChat.messages.length > 0) {
                        existingChat.messages.push({
                            type: 'divider',
                            text: '新增对话',
                            sender: 'system'
                        });
                        existingChat.messages.push(...newChat.messages);
                    }
                } else {
                    // 如果不存在，直接添加
                    mergedChats.push(newChat);
                }
            });

            const mergedSearches = Array.isArray(oldData.browser && oldData.browser.searches) ? [...oldData.browser.searches] : [];
            newSearches.forEach(s => {
                const key = `${s.query}__${s.time || ''}`;
                const exists = mergedSearches.some(x => `${x.query}__${x.time || ''}` === key);
                if (!exists) mergedSearches.push(s);
            });

            const oldWallet = (oldData.wallet && typeof oldData.wallet === 'object') ? oldData.wallet : { balance: null, bills: [] };
            const mergedBills = Array.isArray(oldWallet.bills) ? [...oldWallet.bills] : [];
            newBills.forEach(b => {
                const key = `${b.type}|${b.amount}|${b.time || ''}|${b.title}`;
                const exists = mergedBills.some(x => `${x.type}|${x.amount}|${x.time || ''}|${x.title}` === key);
                if (!exists) mergedBills.push(b);
            });

            let walletBalance = (typeof oldWallet.balance === 'number' && Number.isFinite(oldWallet.balance)) ? oldWallet.balance : null;
            if (walletBalance === null) {
                if (walletInitialBalance !== null && Number.isFinite(walletInitialBalance)) {
                    walletBalance = Number(walletInitialBalance.toFixed(2));
                } else {
                    const fallback = 50 + Math.random() * 4950;
                    walletBalance = Number(fallback.toFixed(2));
                }
            }
            const delta = newBills.reduce((sum, b) => sum + (b.type === 'income' ? b.amount : -b.amount), 0);
            walletBalance = Number((walletBalance + delta).toFixed(2));
            if (walletBalance < 0) walletBalance = 0;

            const phoneData = {
                chats: mergedChats,
                photos: [...(oldData.photos || []), ...newPhotos],
                memos: [...(oldData.memos || []), ...newMemos],
                browser: { searches: mergedSearches },
                wallet: { balance: walletBalance, bills: mergedBills },
                health: parsedHealth
            };
            await localforage.setItem(storageKey, JSON.stringify(phoneData));
            
            showGlobalToast('手机内容已更新', {type: 'success'});
            
            // 5. 刷新当前视图
            if (currentCheckPhoneView === 'chat') openChatView(contact);
            else if (currentCheckPhoneView === 'photos') openPhotosView(contact);
            else if (currentCheckPhoneView === 'memo') openMemoView(contact);
            else if (currentCheckPhoneView === 'browser') openBrowserView(contact);
            else if (currentCheckPhoneView === 'wallet') openWalletView(contact);
            else if (currentCheckPhoneView === 'health') openHealthView(contact);
            
        } catch (e) {
            console.error(e);
            showCustomAlert('生成失败: ' + e.message);
        } finally {
            if (dynamicIsland) {
                dynamicIsland.textContent = '';
                dynamicIsland.style.width = '';
                dynamicIsland.style.display = isDynamicIslandSuppressed ? 'none' : 'block';
            }
        }
    }

    window.addEventListener('open-diary-view-request', async (e) => {
        const { contactId } = e.detail;
        if (!contactId) return;

        // 1. 模拟点击图标打开应用 (初始化环境)
        if (checkPhoneAppIcon) checkPhoneAppIcon.click();

        // 2. 查找联系人对象
        // 确保 window.archiveData 已加载
        if (!window.archiveData) {
            window.archiveData = JSON.parse(await localforage.getItem('archiveData')) || { user: {}, characters: [] };
        }
        const allProfiles = [window.archiveData.user, ...window.archiveData.characters];
        const contact = allProfiles.find(p => p.id === contactId);

        if (contact) {
            // 3. 打开手机模拟器
            openPhoneSimulator(contact);
            // 4. 打开日记 (稍作延迟确保DOM就绪)
            setTimeout(() => {
                openDiaryView(contact);
            }, 300);
        }
    });

});                                                       
