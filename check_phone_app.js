document.addEventListener('DOMContentLoaded', () => {

    const checkPhoneAppIcon = document.getElementById('app-check-phone');
    if (!checkPhoneAppIcon) return;

    // 状态管理，用于控制返回按钮逻辑
    let currentCheckPhoneView = null; // 'list' or 'simulator'

    // 获取通用模态框的元素
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // 存储原始的关闭事件，以便在退出App时恢复
    let originalCloseHandler = null;

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
                    <div class="app-wrapper">
                        <div class="app-icon-box">
                            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M381.7 985.3c-10.2 0-20.4-3.9-28.3-11.7-15.6-15.6-15.6-40.9 0-56.5L496 774.5c39-39 90.9-60.5 146.1-60.5h136.2c91.4 0 165.7-74.3 165.8-165.7V284.4c0-91.4-74.4-165.8-165.8-165.8H245.7c-91.4 0-165.8 74.4-165.8 165.8v263.9c0 91.4 74.4 165.7 165.8 165.7h74.4c22.1 0 40 17.9 40 40s-17.9 40-40 40h-74.4C110.2 793.9 0 683.7 0 548.3V284.4C0 148.9 110.2 38.7 245.7 38.7h532.6c135.5 0 245.7 110.2 245.7 245.7v263.9C1024 683.8 913.8 794 778.3 794H642.2c-33.8 0-65.7 13.2-89.6 37.1L410 973.6c-7.8 7.8-18 11.7-28.3 11.7z"></path><path d="M322.965 425.019m-50.6 0a50.6 50.6 0 1 0 101.2 0 50.6 50.6 0 1 0-101.2 0Z"></path><path d="M512.065 425.019m-50.6 0a50.6 50.6 0 1 0 101.2 0 50.6 50.6 0 1 0-101.2 0Z"></path><path d="M701.165 425.019m-50.6 0a50.6 50.6 0 1 0 101.2 0 50.6 50.6 0 1 0-101.2 0Z"></path></svg>
                        </div>
                        <span class="app-name">聊天</span>
                    </div>
                    <div class="app-wrapper">
                        <div class="app-icon-box">
                            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M668.1 227.3H207.8C93.2 227.3 0 320.6 0 435.1v296.4c0 114.6 93.2 207.8 207.8 207.8H668c114.6 0 207.8-93.2 207.8-207.8V435.1c0.1-114.5-93.1-207.8-207.7-207.8z m139.8 504.2c0 77.1-62.7 139.8-139.8 139.8H207.8c-57.3 0-106.7-34.7-128.3-84.2l217.8-217.8 134.2 134.2c13.3 13.3 34.8 13.3 48.1 0l88.2-88.2 96.6 96.6c13.3 13.3 34.8 13.3 48.1 0 13.3-13.3 13.3-34.8 0-48.1L592 543.2c-13.3-13.3-34.8-13.3-48.1 0l-88.2 88.2-134.3-134.2c-13.3-13.3-34.8-13.3-48.1 0L68 702.6V435.1c0-77.1 62.7-139.8 139.8-139.8H668c77.1 0 139.8 62.7 139.8 139.8v296.4z"></path><path d="M627.440143 485.154298a53.1 53.1 0 1 0 75.093429-75.096051 53.1 53.1 0 1 0-75.093429 75.096051Z"></path><path d="M675.1 84.6h-288c-18.8 0-34 15.2-34 34s15.2 34 34 34h288c154.9 0 280.9 126 280.9 280.9v149.8c0 18.8 15.2 34 34 34s34-15.2 34-34V433.6c0-192.4-156.5-349-348.9-349z"></path></svg>
                        </div>
                        <span class="app-name">相册</span>
                    </div>
                    <div class="app-wrapper">
                        <div class="app-icon-box">
                            <svg t="1769002383741" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1414" width="32" height="32"><path d="M833.45662 318.075039c0-48.501085-39.340651-87.881426-87.897302-87.881427H373.64093c-48.564589 0-87.90524 39.372403-87.90524 87.873489v506.911752c0 48.501085 39.340651 87.873488 87.90524 87.873488h371.918388c48.556651 0 87.897302-39.372403 87.897302-87.873488V318.067101z" fill="#ffffff" p-id="1415"></path><path d="M865.24031 223.493953C865.24031 148.329178 804.197209 87.317829 729.024496 87.317829H287.037519C211.864806 87.317829 150.821705 148.329178 150.821705 223.493953v584.934202c0 75.164775 61.043101 136.184062 136.215814 136.184062h441.986977c75.172713 0 136.215814-61.019287 136.215814-136.184062V223.493953zM718.784496 150.821705h10.24c40.166202 0 72.711938 32.56955 72.711938 72.680186v584.934202c0 40.110636-32.545736 72.680186-72.711938 72.680186H287.037519c-40.166202 0-72.711938-32.56955-72.711938-72.680186V223.493953C214.325581 183.383318 246.871318 150.821705 287.037519 150.821705h188.685892v248.435101c0 0.277829 0.07938 0.658853 0.07938 0.936682 0 0.94462 0.15876 1.801922 0.317519 2.738605 0.07938 0.754109 0.15876 1.516155 0.317519 2.270264 0.23814 0.849364 0.476279 1.603473 0.793799 2.357581 0.23814 0.754109 0.555659 1.603473 0.952558 2.357581 0.23814 0.658853 0.714419 1.325643 1.111318 2.071814 0.476279 0.762047 0.952558 1.611411 1.508217 2.270264 0.23814 0.285767 0.317519 0.571535 0.476279 0.754108 0.317519 0.285767 0.555659 0.468341 0.873178 0.762047 0.714419 0.841426 1.587597 1.690791 2.460775 2.444899 0.555659 0.468341 1.031938 0.94462 1.587597 1.325644 0.952558 0.658853 1.905116 1.22245 2.937055 1.793984 0.555659 0.277829 1.031938 0.658853 1.666976 0.94462 1.270078 0.563597 2.460775 0.94462 3.810233 1.317706 0.476279 0.095256 0.793798 0.285767 1.270077 0.373085 1.746357 0.381023 3.492713 0.571535 5.39783 0.571535 1.587597 0 3.095814-0.190512 4.604031-0.468341 0.555659-0.103194 1.031938-0.293705 1.508217-0.381024 0.952558-0.285767 1.984496-0.563597 2.937054-0.94462 0.555659-0.190512 1.111318-0.468341 1.746357-0.754108 0.793798-0.381023 1.587597-0.849364 2.460775-1.317706l2.540155-1.706666 81.126202-64.639008 78.665426 68.226977a6.985426 6.985426 0 0 0 1.349457 0.94462c0.555659 0.468341 1.111318 0.849364 1.825737 1.325643 0.714419 0.468341 1.587597 0.849364 2.302015 1.317706 0.635039 0.285767 1.270078 0.563597 1.825737 0.849364 0.952558 0.381023 1.905116 0.658853 2.937054 0.94462 0.555659 0.182574 1.031938 0.373085 1.587597 0.468341 1.587597 0.285767 3.175194 0.476279 4.84217 0.476279 1.746357 0 3.492713-0.190512 5.15969-0.571535l0.952558-0.277829c1.349457-0.381023 2.698915-0.762047 3.968993-1.325643 0.555659-0.190512 1.031938-0.563597 1.508217-0.849365 1.031938-0.563597 1.984496-1.031938 2.937054-1.698728 0.555659-0.381023 1.031938-0.849364 1.508217-1.22245 0.793798-0.762047 1.666977-1.420899 2.460775-2.262326l0.555659-0.571535 0.873179-1.135131c0.555659-0.754109 1.031938-1.412961 1.508217-2.16707 0.317519-0.658853 0.714419-1.412961 1.111317-2.079752 0.396899-0.754109 0.714419-1.508217 1.031938-2.262326 0.23814-0.754109 0.555659-1.603473 0.714419-2.357581 0.23814-0.754109 0.396899-1.508217 0.476279-2.357581 0.23814-0.857302 0.23814-1.793984 0.317519-2.643349 0-0.476279 0.15876-0.94462 0.15876-1.420899V150.813767z m-50.88248 0v197.092217l-52.628838-45.667224c-0.07938-0.095256-0.07938-0.095256-0.158759-0.095256-0.476279-0.373085-0.952558-0.658853-1.428838-1.039876-0.317519-0.190512-0.555659-0.563597-0.952558-0.754109-0.317519-0.182574-0.555659-0.285767-0.873178-0.476279-0.317519-0.182574-0.635039-0.468341-1.031938-0.650914-0.476279-0.285767-1.031938-0.476279-1.508217-0.666791-0.396899-0.190512-0.635039-0.373085-1.031938-0.563597-0.23814-0.095256-0.635039-0.190512-0.952558-0.285767-0.396899-0.095256-0.635039-0.277829-1.031938-0.468342-0.476279-0.190512-1.031938-0.190512-1.508217-0.381023-0.396899-0.095256-0.714419-0.285767-1.190698-0.373085-0.317519-0.103194-0.714419 0-0.952558-0.103194-0.396899-0.087318-0.793798-0.182574-1.031938-0.182574-0.476279-0.095256-1.031938 0-1.587597-0.095255-0.793798 0-1.666977-0.095256-2.381395-0.095256h-0.952558c-0.555659 0-1.111318 0.190512-1.746357 0.285767-0.396899 0.087318-0.873178 0.087318-1.349457 0.190512-0.317519 0.087318-0.476279 0.190512-0.793799 0.190512-0.23814 0.087318-0.635039 0.087318-0.952558 0.182573-0.555659 0.190512-1.031938 0.381023-1.587597 0.571535-0.476279 0.182574-0.952558 0.277829-1.428837 0.468341l-0.635039 0.381023c-0.317519 0.182574-0.635039 0.277829-0.952558 0.373086-0.476279 0.285767-0.952558 0.571535-1.428837 0.94462-0.07938 0.095256-0.15876 0.190512-0.31752 0.190511-0.317519 0.190512-0.635039 0.277829-0.873178 0.468342-0.07938 0.095256-0.23814 0.190512-0.396899 0.285767-0.396899 0.285767-0.873178 0.563597-1.270078 0.849364-0.07938 0-0.07938 0.095256-0.158759 0.095256l-56.51845 45.008372V150.821705h141.613644z" p-id="1416"></path></svg>
                        </div>
                        <span class="app-name">备忘录</span>
                    </div>
                    <!-- 第2行APP -->
                    <div class="app-wrapper" id="phone-diary-btn">
                        <div class="app-icon-box">
                            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M826.85 431.04l-16.16-48.02c-2.52-7.48-12.97-7.81-15.96-0.51l-15.1 36.87c-1.87 4.55-2 9.64-0.36 14.28l1.32 3.76a40.102 40.102 0 0 1-0.64 28.24l-119.7 297.02c-6.99 17.35-25.05 27.55-43.52 24.59l-326.1-52.37a39.909 39.909 0 0 1-29.36-21.55l-10.93-21.86c-3.72-7.42 2.53-15.92 10.72-14.61l322.79 51.84c18.39 2.95 36.38-7.15 43.43-24.37l164.37-401.31c9.78-23.87-5.21-50.62-30.67-54.74l-346.45-56.19c-18.4-2.98-36.43 7.11-43.49 24.36L200.38 633.08a71.317 71.317 0 0 0 3.86 62.02l24.29 43.14a71.295 71.295 0 0 0 50.83 35.42l362.43 58.21c18.46 2.97 36.51-7.22 43.51-24.56l140.75-348.5c3.58-8.86 3.87-18.72 0.82-27.79z m-296.13-50.21c1 1.87 3.68 2.39 5.93 1.17 97.28-52.76 173.74 73.13 18.03 135.18-37.28 15.38-52.12 18.83-79.38 27.59-5.65 1.82-11.53 0.66-14.97-2.96-16.69-17.52-26.55-25.68-46.78-52.5-85.83-109.75 74.11-188.95 117.17-108.49z"></path></svg>
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
                            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M554.666667 768v85.333333h170.666666v42.666667H341.333333v-42.666667h170.666667v-85.333333c-166.4-12.8-298.666667-149.333333-298.666667-320S345.6 140.8 512 128h42.666667c166.4 12.8 298.666667 149.333333 298.666666 320s-132.266667 307.2-298.666666 320z m-21.333334-42.666667c153.6 0 277.333333-123.733333 277.333334-277.333333S686.933333 170.666667 533.333333 170.666667 256 294.4 256 448 379.733333 725.333333 533.333333 725.333333z m0-213.333333c-34.133333 0-64-29.866667-64-64S499.2 384 533.333333 384s64 29.866667 64 64-29.866667 64-64 64z"></path></svg>
                        </div>
                        <span class="app-name">监控</span>
                    </div>
                    <div class="app-wrapper">
                        <div class="app-icon-box">
                            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M398.262074 660.178831l68.918649 0c58.161654 0 110.673635-22.654976 148.8317-60.376089l0-0.25685c38.419008-37.46631 62.015426-88.768743 62.015426-145.875369l-5.095042-201.850218L189.773669 251.820306l0 210.607672c0 57.106626 22.017456 99.652628 59.940161 137.117914C287.873941 637.012202 340.382852 660.178831 398.262074 660.178831L398.262074 660.178831zM98.612437 834.122465c-19.23918 0-32.647561-22.177092-32.647561-41.328267 0-18.905582 10.414187-31.874965 29.65439-31.874965l683.85609 0c19.23918 0 30.054503 12.969383 30.054503 31.874965 0 19.152199-12.068873 41.328267-31.309076 41.328267L98.612437 834.122465zM734.876602 512.019443l89.198531 0c19.537985 0 42.465161-12.45773 55.301514-25.301246 12.889565-12.81998 21.266349-30.659277 21.266349-50.481741l0-30.968315c0-19.488867-4.214998-41.460274-17.10354-54.30379-12.836353-13.360286-42.403762-24.813129-61.941747-24.813129l-86.721107 0L734.876602 512.019443zM821.597709 264.209474c36.499285 0 82.634022 19.542078 106.541525 42.831504 23.931039 23.760147 29.894867 62.857607 29.894867 98.723465l0 26.916023c0 35.886325-5.963829 70.239737-29.894867 93.979418-23.907503 23.760147-67.563792 43.924395-104.064101 43.924395l-89.198531 0c0 0-1.240247-2.440585-14.867616 14.642488-13.626345 17.08205-56.045457 60.539818-56.045457 60.539818s-55.94108 79.268368-193.176674 79.268368l-66.373687 0c-74.478272 0-143.061276-30.045293-192.404078-78.30646l0.50142 0-0.50142-0.466628c-49.091068-48.485271-84.179214-110.376876-84.179214-183.830819L127.829875 214.654848c0-18.929118 5.78782-24.777313 24.777313-24.777313l557.491077 0c18.738783 0 24.777313 5.848195 24.777313 24.777313l0 49.554626L821.597709 264.209474z"></path></svg>
                        </div>
                        <span class="app-name">往事</span>
                    </div>
                </div>
        `;
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
        }
        
        // 新增：为手机屏幕添加事件委托
        const screenView = document.getElementById('phone-screen-view');
        if (screenView) {
            screenView.addEventListener('click', e => {
                const diaryBtn = e.target.closest('#phone-diary-btn');
                if (diaryBtn) {
                    openDiaryView(contact);
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
        
        const screenView = document.getElementById('phone-screen-view');
        if (!screenView) return;

        // 设置页面的HTML结构，注意添加了内联的padding-top
        const settingsHTML = `
            <div style="padding: 50px 20px 20px; display: flex; flex-direction: column; height: 100%; color: var(--text-color); overflow-y: auto;">
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
                        
                        // 3. 立即将壁纸应用到手机框架的背景上，提供即时反馈
                        phoneFrame.style.backgroundImage = `url('${imageUrl}')`;
                        phoneFr
                        ame.style.backgroundSize = 'cover';
                        phoneFrame.style.backgroundPosition = 'center';

                        // 4. 给出成功提示
                        showGlobalToast('壁纸设置成功！', { type: 'success', duration: 2000 });
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }
// === 新增：日记App相关功能函数 ===
/**
 * 打开日记主界面
 * @param {object} contact - 当前查看的联系人对象
 */
async function openDiaryView(contact) {
    currentCheckPhoneView = 'diary'; // 更新视图状态
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
                <!-- 1. 预设管理部分移到上方 -->
                <div class="preset-controls" style="margin-bottom: 12px;">
                    <select id="diary-style-preset-select" class="modal-select"></select>
                    <button id="save-diary-style-btn" class="modal-button" style="padding: 8px 12px; font-size: 13px;">保存</button>
                    <button id="update-diary-style-btn" class="modal-button secondary" style="padding: 8px 12px; font-size: 13px;">更新</button>
                    <button id="delete-diary-style-btn" class="modal-button secondary" style="background-color:#be123c; color:white; padding: 8px 12px; font-size: 13px;">删除</button>
                </div>

                <!-- 2. 主输入框在中间 -->
                <textarea id="diary-writing-style-textarea" class="modal-input" placeholder="在此输入或从预设加载主要文风...">${escapeHTML(settings.activeWritingStyle || '')}</textarea>
                
                <!-- 3. 多选区域在下方 -->
                <div id="writing-style-presets-list">
                    <!-- 多选框将在这里动态生成 -->
                </div>
            </div>
        </div>
    `;
    
    const screenView = document.getElementById('phone-screen-view');
    screenView.appendChild(overlay);

    // --- 逻辑绑定 ---
    const styleTextarea = document.getElementById('diary-writing-style-textarea');
    const stylePresetSelect = document.getElementById('diary-style-preset-select');
    const styleCheckboxList = document.getElementById('writing-style-presets-list');

    // 渲染文风预设下拉菜单
    const renderStylePresetDropdown = () => {
        const presets = settings.writingStylePresets || {};
        stylePresetSelect.innerHTML = '<option value="">加载预设到输入框...</option>';
        for (const name in presets) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            stylePresetSelect.appendChild(option);
        }
    };
    
    // 渲染文风预设多选列表
    const renderStyleCheckboxList = () => {
        const presets = settings.writingStylePresets || {};
        const selected = settings.selectedStyles || [];
        styleCheckboxList.innerHTML = '';
        if (Object.keys(presets).length === 0) {
            styleCheckboxList.innerHTML = '<span class="empty-text" style="font-size: 12px; opacity: 0.7;">暂无预设</span>';
            return;
        }
        for (const name in presets) {
            const isChecked = selected.includes(name);
            const itemHTML = `
                <label class="preset-checkbox-item">
                    <input type="checkbox" value="${escapeHTML(name)}" ${isChecked ? 'checked' : ''}>
                    <span>${escapeHTML(name)}</span>
                </label>
            `;
            styleCheckboxList.innerHTML += itemHTML;
        }
    };
    
    // 初始渲染
    renderStylePresetDropdown();
    renderStyleCheckboxList();
    
    // 保存所有日记设置的统一函数
    const saveAllDiarySettings = async () => {
        settings.apiPresetName = document.getElementById('diary-api-preset-select').value;
        settings.activeWritingStyle = styleTextarea.value;
        settings.selectedStyles = Array.from(styleCheckboxList.querySelectorAll('input:checked')).map(input => input.value);
        await localforage.setItem(storageKey, JSON.stringify(settings));
    };

    // 事件监听
    styleTextarea.addEventListener('input', saveAllDiarySettings);
    stylePresetSelect.addEventListener('change', () => {
        const selectedName = stylePresetSelect.value;
        if (selectedName && settings.writingStylePresets[selectedName]) {
            styleTextarea.value = settings.writingStylePresets[selectedName];
            saveAllDiarySettings();
        }
    });
    styleCheckboxList.addEventListener('change', saveAllDiarySettings);
    document.getElementById('diary-api-preset-select').addEventListener('change', saveAllDiarySettings);

    // 管理按钮的事件
    document.getElementById('save-diary-style-btn').addEventListener('click', () => {
        showCustomPrompt('输入新文风预设的标题:', '', async (title) => {
            if (title && title.trim()) {
                title = title.trim();
                settings.writingStylePresets = settings.writingStylePresets || {};
                settings.writingStylePresets[title] = styleTextarea.value;
                await localforage.setItem(storageKey, JSON.stringify(settings));
                renderStylePresetDropdown();
                renderStyleCheckboxList();
                stylePresetSelect.value = title;
            }
        });
    });

    document.getElementById('update-diary-style-btn').addEventListener('click', async () => {
        const selectedName = stylePresetSelect.value;
        if (!selectedName) {
            showCustomAlert('请先从下拉菜单中选择一个要更新的预设。');
            return;
        }
        showCustomConfirm(`确定要用当前内容更新预设 "${selectedName}" 吗？`, async () => {
            settings.writingStylePresets[selectedName] = styleTextarea.value;
            await localforage.setItem(storageKey, JSON.stringify(settings));
            showGlobalToast('文风预设已更新！', { type: 'success' });
            renderStyleCheckboxList(); // 更新多选区的显示
        });
    });

    document.getElementById('delete-diary-style-btn').addEventListener('click', async () => {
        const selectedName = stylePresetSelect.value;
        if (!selectedName) {
            showCustomAlert('请先从下拉菜单中选择一个要删除的预设。');
            return;
        }
        showCustomConfirm(`确定要删除预设 "${selectedName}" 吗？`, async () => {
            delete settings.writingStylePresets[selectedName];
            // 如果删除的预设也在已勾选列表中，则一并移除
            settings.selectedStyles = settings.selectedStyles.filter(s => s !== selectedName);
            await localforage.setItem(storageKey, JSON.stringify(settings));
            renderStylePresetDropdown();
            renderStyleCheckboxList();
        });
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

        const mainWritingStyle = diarySettings.activeWritingStyle || '';
        const additionalStyles = (diarySettings.selectedStyles || [])
            .map(name => (diarySettings.writingStylePresets || {})[name])
            .filter(Boolean)
            .join('\n\n');
        
        let finalWritingStyle = mainWritingStyle + (additionalStyles ? `\n\n【补充文风要求】:\n${additionalStyles}` : '');
        
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

});                                                       
