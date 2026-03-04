(function () {
    const overlay = document.getElementById('tutorial-sheet-overlay');
    const sheet = document.getElementById('tutorial-sheet');
    const openBtn = document.getElementById('home-search-pill');
    const closeBtn = document.getElementById('tutorial-sheet-close');
    const searchBtn = document.getElementById('tutorial-search-btn');
    const searchInput = document.getElementById('tutorial-search-input');
    const suggest = document.getElementById('tutorial-search-suggest');
    const contentEl = document.getElementById('tutorial-content');

    if (!overlay || !sheet || !openBtn || !closeBtn || !searchInput || !suggest || !contentEl) {
        return;
    }

    const normalize = (s) => (s || '').toString().trim().toLowerCase();

    const tutorialData = [
        {
            category: 'API 设置',
            keywords: ['api', '密钥', 'url', '模型', '预设', '语音', 'minimax', '渠道', '反代'],
            items: [
                {
                    id: 'api-config',
                    title: 'API 配置',
                    keywords: ['api', '配置', '渠道', '官方', '站子', '反代'],
                    blocks: [
                        { type: 'p', text: 'API 配置包含 API 的基本概念、获取渠道以及使用方法。' }
                    ],
                    children: [
                        {
                            id: 'api-what-is',
                            title: 'API 是什么',
                            keywords: ['api', '接口', '服务', '模型'],
                            blocks: [
                                { type: 'p', text: 'API（应用程序编程接口）是连接本系统与外部 AI 模型服务的桥梁。' },
                                {
                                    type: 'list',
                                    items: [
                                        '通过 API，本系统可以调用远程的 AI 模型进行对话、生成内容等。',
                                        'API 提供了标准化的请求与响应格式，让不同服务商的模型可以统一接入。',
                                        '每个 API 服务通常包含访问地址（URL）与身份凭证（密钥）。'
                                    ]
                                },
                                { type: 'quote', text: '简单理解：{accent:API 就是"打电话给模型服务商"的专线}。' }
                            ]
                        },
                        {
                            id: 'api-channels',
                            title: 'API 渠道',
                            keywords: ['渠道', '官方', 'api 站子', '反代', '代理'],
                            blocks: [
                                { type: 'p', text: 'API 渠道指获取 API 服务的来源方式，不同渠道在稳定性、价格、可用性上有所差异。' }
                            ],
                            children: [
                                {
                                    id: 'api-channel-official',
                                    title: '官方渠道',
                                    keywords: ['官方', '官网', '直接'],
                                    blocks: [
                                        { type: 'p', text: '官方渠道指直接从模型服务商的官方网站注册并获取 API 密钥。' },
                                        {
                                            type: 'list',
                                            items: [
                                                '优点：稳定性高、文档完善、技术支持可靠。',
                                                '缺点：可能需要海外支付方式、部分服务有地域限制。',
                                                '适合：追求稳定、有支付条件的用户。'
                                            ]
                                        },
                                        { type: 'callout', title: '示例', text: 'OpenAI 官网、Anthropic 官网、Google AI 官网等。' }
                                    ]
                                },
                                {
                                    id: 'api-channel-provider',
                                    title: 'API 站子',
                                    keywords: ['站子', '第三方', '中转', '代理'],
                                    blocks: [
                                        { type: 'p', text: 'API 站子（第三方中转服务商）提供 API 转售服务，通常整合了多家官方渠道。' },
                                        {
                                            type: 'list',
                                            items: [
                                                '优点：支付便捷（支持支付宝/微信）、价格相对灵活、部分支持国内访问。',
                                                '缺点：稳定性依赖运营商、需注意选择信誉良好的服务商。',
                                                '适合：国内用户、临时使用、成本敏感场景。'
                                            ]
                                        },
                                        { type: 'callout', title: '注意', text: '选择 API 站子时建议先小额测试，确认稳定性与响应速度后再长期使用。' }
                                    ]
                                },
                                {
                                    id: 'api-channel-self-proxy',
                                    title: '自己搭反代',
                                    keywords: ['反代', '自建', '代理', 'cloudflare'],
                                    blocks: [
                                        { type: 'p', text: '自己搭建反向代理（Reverse Proxy）来中转 API 请求，通常用于解决网络访问限制或优化响应速度。' },
                                        {
                                            type: 'list',
                                            items: [
                                                '技术门槛：需要一定的服务器部署与网络知识。',
                                                '常见方案：使用 Cloudflare Workers、VPS 自建代理等。',
                                                '优点：可控性强、可定制路由策略、可能降低成本。',
                                                '缺点：需要维护成本、可能违反服务商条款。'
                                            ]
                                        },
                                        { type: 'callout', title: '提示', text: '自建反代需注意合规性，避免违反 API 服务商的使用条款。' }
                                    ]
                                }
                            ]
                        },
                        {
                            id: 'api-how-to-use',
                            title: '如何使用 API',
                            keywords: ['使用', '配置', '填入', '拉取'],
                            blocks: [
                                { type: 'p', text: '配置 API 需要填写必要的连接信息，然后选择可用模型即可开始使用。' }
                            ],
                            children: [
                                {
                                    id: 'api-url-format',
                                    title: 'API 接口格式',
                                    keywords: ['url', '后缀', 'v1', '格式'],
                                    blocks: [
                                        { type: 'p', text: '大多数兼容 OpenAI 格式的 API 接口，其 URL 后缀通常是 */v1*。' },
                                        {
                                            type: 'list',
                                            items: [
                                                '标准格式：https://api.example.com/v1',
                                                '完整示例：https://api.openai.com/v1、https://api.anthropic.com/v1 等。',
                                                '注意：部分服务商可能使用不同的版本号（如/v1beta），需参考官方文档。'
                                            ]
                                        },
                                        { type: 'quote', text: '填写 URL 时确保包含 {accent:/v1} 后缀，否则可能无法正确拉取模型列表。' }
                                    ]
                                },
                                {
                                    id: 'api-key-format',
                                    title: 'API 密钥格式',
                                    keywords: ['密钥', 'sk-', '格式', '开头'],
                                    blocks: [
                                        { type: 'p', text: 'API 密钥是用于身份验证的凭证，大多数服务商的密钥以特定前缀开头。' },
                                        {
                                            type: 'list',
                                            items: [
                                                '常见格式：以 *sk-* 开头（如 sk-abc123...）。',
                                                '其它前缀：部分服务商可能使用不同前缀（如 key-、token- 等）。',
                                                '安全提示：密钥等同于密码，请勿分享给他人或上传到公开平台。'
                                            ]
                                        },
                                        { type: 'callout', title: '安全', text: '密钥泄露可能导致盗用与费用损失，建议定期检查密钥使用情况。' }
                                    ]
                                },
                                {
                                    id: 'api-model-selection',
                                    title: '选择模型',
                                    keywords: ['模型', '拉取', '下拉框', '选择'],
                                    blocks: [
                                        { type: 'p', text: '填写完 URL 与密钥后，系统会自动拉取可用模型列表供选择。' },
                                        {
                                            type: 'list',
                                            items: [
                                                '点击「拉取模型」按钮，系统会向 API 服务发送请求获取可用模型。',
                                                '在下拉框中选择合适的模型（如 gpt-4、claude-3 等）。',
                                                '不同预设可以使用不同模型，便于在多个场景间切换。'
                                            ]
                                        },
                                        { type: 'quote', text: '如果拉取失败，请检查 {accent:URL 是否正确}、{accent:密钥是否有效}、{accent:网络是否可达}。' }
                                    ]
                                }
                            ]
                        },
                        {
                            id: 'api-presets',
                            title: 'API 预设',
                            keywords: ['预设', '保存', '更新', '删除', '切换'],
                            blocks: [
                                { type: 'p', text: 'API 预设用于保存一整套"连接参数 + 模型选择"的组合，便于在不同服务商、不同用途之间切换。' }
                            ],
                            children: [
                                {
                                    id: 'api-preset-save',
                                    title: '保存',
                                    keywords: ['保存', '新增', '创建'],
                                    blocks: [
                                        { type: 'p', text: '配置完 API 信息后，可以保存为预设以便后续快速切换使用。' },
                                        {
                                            type: 'list',
                                            items: [
                                                '填写预设名称（建议使用「供应商 - 用途」格式，如 OpenAI-日常）。',
                                                '确认 URL、密钥、模型等信息无误。',
                                                '点击「保存」按钮，预设会添加到预设列表中。'
                                            ]
                                        },
                                        { type: 'callout', title: '提示', text: '首次配置建议先保存并测试连接，确认可用后再用于正式场景。' }
                                    ]
                                },
                                {
                                    id: 'api-preset-update',
                                    title: '更新',
                                    keywords: ['更新', '修改', '编辑'],
                                    blocks: [
                                        { type: 'p', text: '当 API 信息变更（如密钥轮换、URL 调整）时，可以更新已有预设。' },
                                        {
                                            type: 'list',
                                            items: [
                                                '在预设列表中选择要更新的预设。',
                                                '修改 URL、密钥、模型等信息。',
                                                '点击「更新」按钮保存变更。'
                                            ]
                                        },
                                        { type: 'quote', text: '更新预设不会影响正在使用该预设的场景，切换后生效。' }
                                    ]
                                },
                                {
                                    id: 'api-preset-delete',
                                    title: '删除',
                                    keywords: ['删除', '移除'],
                                    blocks: [
                                        { type: 'p', text: '不再使用的预设可以删除，避免列表过于冗长。' },
                                        {
                                            type: 'list',
                                            items: [
                                                '在预设列表中选择要删除的预设。',
                                                '点击「删除」按钮并确认操作。',
                                                '删除后无法恢复，请谨慎操作。'
                                            ]
                                        },
                                        { type: 'callout', title: '注意', text: '删除预设前请确认没有场景正在使用该预设，否则可能导致相关功能不可用。' }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 'api-voice',
                    title: 'Minimax 语音',
                    keywords: ['minimax', '语音', 'groupid', '密钥', '官网'],
                    blocks: [
                        { type: 'p', text: 'Minimax 语音模块用于接入语音合成/朗读等语音相关能力。' },
                        { type: 'p', text: '官方网站：https://platform.minimaxi.com/examination-center/voice-experience-center/voiceCloning' }
                    ],
                    children: [
                        {
                            id: 'api-voice-register',
                            title: '注册流程',
                            keywords: ['注册', '登录', '实名认证'],
                            blocks: [
                                { type: 'p', text: '使用 Minimax 语音服务前需要完成账号注册与认证。' },
                                {
                                    type: 'list',
                                    items: [
                                        '访问 Minimax 开放平台官网。',
                                        '使用手机号或邮箱注册账号。',
                                        '完成实名认证（部分功能可能需要）。',
                                        '进入语音体验中心或语音克隆页面获取凭证。'
                                    ]
                                },
                                { type: 'callout', title: '提示', text: '注册流程可能随平台政策调整，具体以官网最新指引为准。' }
                            ]
                        },
                        {
                            id: 'api-voice-operation',
                            title: '操作',
                            keywords: ['操作', '使用', '配置'],
                            blocks: [
                                { type: 'p', text: '获取 Minimax 凭证后，需要在系统中进行配置才能使用语音功能。' },
                                {
                                    type: 'list',
                                    items: [
                                        '在 Minimax 开放平台获取 GroupID 和 API 密钥。',
                                        '在系统设置中找到 Minimax 语音配置区域。',
                                        '填入 GroupID 和 API 密钥并保存。',
                                        '测试语音功能是否正常工作。'
                                    ]
                                },
                                { type: 'callout', title: '注意', text: '确保 GroupID 和 API 密钥对应同一个账号，否则可能导致认证失败。' }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            category: '美化设置',
            keywords: ['主题', '强调色', '壁纸', '昼夜', '字体', '音效', '通知'],
            items: [
                {
                    id: 'beauty-theme',
                    title: '主题与昼夜模式',
                    keywords: ['主题', '昼夜', '系统'],
                    blocks: [
                        { type: 'p', text: '主题决定整体的明暗、文字与图标颜色，以及玻璃质感的透明度。' },
                        {
                            type: 'list',
                            items: [
                                '跟随系统：根据系统昼夜模式自动切换。',
                                '组件联动：主屏、按钮、图标等会随主题变量统一变化。'
                            ]
                        }
                    ]
                },
                {
                    id: 'beauty-accent',
                    title: '主题强调色',
                    keywords: ['强调色', '高亮', '按钮'],
                    blocks: [
                        { type: 'p', text: '强调色用于关键按钮、选中态与高亮文本，让界面"重点更明确"。' },
                        { type: 'quote', text: '例如：教程里用 {accent:强调色} 标出关键概念与命名规则。' }
                    ]
                },
                {
                    id: 'beauty-wallpaper',
                    title: '昼夜壁纸',
                    keywords: ['壁纸', '主屏', '昼夜'],
                    blocks: [
                        { type: 'p', text: '昼夜壁纸用于主屏背景，日间与夜间可以使用不同图片。' },
                        { type: 'p', text: '壁纸与主题联动：在昼夜切换时自动展示对应背景。' }
                    ]
                },
                {
                    id: 'beauty-font',
                    title: '字体管理',
                    keywords: ['字体', '预览', '预设'],
                    blocks: [
                        { type: 'p', text: '字体管理用于导入与管理字体来源，并提供可复用的字体预设。' },
                        {
                            type: 'list',
                            items: [
                                '字体预览：用于确认字体是否可加载、效果是否符合预期。',
                                '字体预设：保存常用字体方案，供其它区域复用。',
                                '局部字体：部分模块可在局部使用指定字体预设。'
                            ]
                        }
                    ]
                },
                {
                    id: 'beauty-notify-sfx',
                    title: '通知与音效',
                    keywords: ['通知', '横幅', '音效'],
                    blocks: [
                        { type: 'p', text: '这里管理系统通知与界面音效的开关与体验。' },
                        {
                            type: 'list',
                            items: [
                                '系统通知横幅：用于在系统层显示提醒（目前不稳定）。',
                                '内置音效：为关键交互提供提示音。'
                            ]
                        },
                        { type: 'callout', title: '注意', text: '系统通知横幅标注为"不稳定"，后续会优化。' }
                    ]
                }
            ]
        },
        {
            category: '预设管理',
            keywords: ['预设', '世界书', '正则', '文风'],
            items: [
                {
                    id: 'preset-worldbook',
                    title: '世界书（World Book）',
                    keywords: ['世界书', '分类', '条目', '注入位置'],
                    blocks: [
                        { type: 'p', text: '世界书用于组织"设定与资料库"。内容以 {accent:分类 → 条目} 的层级管理。' },
                        {
                            type: 'list',
                            items: [
                                '分类：用于把设定按主题分组。',
                                '条目：每条包含标题与正文内容。',
                                '注入位置：前 / 中 / 后 / 关键词（用于控制内容介入的策略）。'
                            ]
                        }
                    ]
                },
                {
                    id: 'preset-regex',
                    title: '正则（Regex）',
                    keywords: ['正则', 'pattern', 'replacement', 'scope'],
                    blocks: [
                        { type: 'p', text: '正则用于对文本进行规则化处理：按模式匹配并进行替换或变换。' },
                        {
                            type: 'list',
                            items: [
                                '规则字段：规则名、正则表达式（pattern）、替换内容（replacement）。',
                                '适用范围：{accent:全局} / {accent:副本中} / {accent:Chat 聊天（可选联系人）}。',
                                '分类管理：按分类组织规则，便于维护。'
                            ]
                        }
                    ]
                },
                {
                    id: 'preset-writing-style',
                    title: '文风（Writing Style）',
                    keywords: ['文风', '分组', '条目'],
                    blocks: [
                        { type: 'p', text: '文风用于管理写作/回复的风格模板，同样按 {accent:分组 → 文风条目} 组织。' },
                        {
                            type: 'list',
                            items: [
                                '分组：把不同场景的文风归类（例如日常/剧情/商务）。',
                                '文风条目：每条包含标题与文风内容（可作为模板素材）。'
                            ]
                        }
                    ]
                }
            ]
        },
        {
            category: '数据管理',
            keywords: ['数据', '备份', '导入', '导出'],
            items: [
                {
                    id: 'data-backup',
                    title: '数据备份与迁移',
                    keywords: ['备份', '导出', '导入', '恢复'],
                    blocks: [
                        { type: 'p', text: '数据管理用于把本机数据进行备份与迁移，避免更换设备或清理缓存后丢失。' },
                        {
                            type: 'list',
                            items: [
                                '导出备份：将当前数据打包为备份文件。',
                                '导入备份：从备份文件恢复到本机。',
                                '数据范围：可覆盖多个模块的数据（如 Chat/档案/副本/预设等）。'
                            ]
                        },
                        { type: 'callout', title: '提示', text: '备份属于"全局数据"动作，建议在重要更新前做一次备份。' }
                    ]
                }
            ]
        },
        {
            category: '桌面日历',
            keywords: ['日历', '月历', '打卡', '小组件'],
            items: [
                {
                    id: 'calendar-widget',
                    title: '月历小组件',
                    keywords: ['月历', '今日', '打卡'],
                    blocks: [
                        { type: 'p', text: '桌面日历以月视图展示当月日期，并标记当天与打卡状态。' },
                        {
                            type: 'list',
                            items: [
                                '月份标题：显示当前年月。',
                                '今日高亮：当日日期会被突出显示。',
                                '打卡标记：已打卡日期会显示小圆点，记录保存在本机。'
                            ]
                        }
                    ]
                }
            ]
        },
        {
            category: 'Chat',
            keywords: ['聊天', '联系人', '分组', '存档', '行程', '朋友圈'],
            items: [
                {
                    id: 'chat-contacts',
                    title: '联系人与分组',
                    keywords: ['联系人', '分组', '置顶', '未读'],
                    blocks: [
                        { type: 'p', text: '聊天模块包含联系人列表与分组体系，用于管理会话入口与未读状态。' },
                        {
                            type: 'list',
                            items: [
                                '置顶区与普通区：用于区分优先级。',
                                '分组（AppGroup）：分组展开/折叠与成员管理。',
                                '未读提示：联系人卡片可显示未读数。'
                            ]
                        }
                    ]
                },
                {
                    id: 'chat-messages',
                    title: '消息与互动',
                    keywords: ['消息', '语音', '图片', '引用', '编辑', '撤回', '多选'],
                    blocks: [
                        { type: 'p', text: '聊天页支持多种消息类型与消息级操作，用于更细的对话编辑与整理。' },
                        {
                            type: 'list',
                            items: [
                                '消息类型：文本、图片/表情包、语音、引用块等。',
                                '消息级操作：引用 / 多选 / 编辑 / 撤回 等（用于整理与再编辑）。',
                                '聊天设置：按联系人维度保存美化与偏好设置。'
                            ]
                        }
                    ]
                },
                {
                    id: 'chat-tools',
                    title: '聊天工具面板',
                    keywords: ['工具', '快捷回复', 'api', '总结', '音乐', '礼物', '定位', '行程'],
                    blocks: [
                        { type: 'p', text: '工具面板提供一组扩展能力，用于把聊天变成"可操作的工作台"。' },
                        {
                            type: 'list',
                            items: [
                                '媒体与表达：表情包、图片、语音、视频通话。',
                                'AI 相关：API 切换、总结、快捷回复。',
                                '互动与功能：礼物、转账、定位、话题、行程、小程序等。'
                            ]
                        }
                    ]
                },
                {
                    id: 'chat-archive-schedule',
                    title: '存档与行程',
                    keywords: ['存档', '导入', '行程', '时间轴'],
                    blocks: [
                        { type: 'p', text: '聊天支持按联系人管理"存档"，并提供行程时间轴作为独立能力。' },
                        {
                            type: 'list',
                            items: [
                                '存档体系：用于保存同一联系人的不同对话阶段。',
                                '存档导入：支持从外部记录生成新的存档条目。',
                                '行程（Schedule）：时间轴视图与日期导航。'
                            ]
                        }
                    ]
                },
                {
                    id: 'chat-moments',
                    title: '朋友圈（Moments）',
                    keywords: ['朋友圈', 'moments'],
                    blocks: [
                        { type: 'p', text: '朋友圈是聊天模块的独立视图，用于展示动态流。' }
                    ]
                }
            ]
        },
        {
            category: '档案',
            keywords: ['档案', '角色', '人设', '阶段性人设', '开场白', '好感'],
            items: [
                {
                    id: 'archive-home',
                    title: '档案主页',
                    keywords: ['角色列表', '用户卡片'],
                    blocks: [
                        { type: 'p', text: '档案用于管理你与角色的资料库：包含用户档案与角色档案的卡片网格。' },
                        {
                            type: 'list',
                            items: [
                                '用户档案：个人信息与基础设定。',
                                '角色档案：角色列表与角色概览卡片。',
                                '详情页：点开卡片进入更完整的档案内容。'
                            ]
                        }
                    ]
                },
                {
                    id: 'archive-detail',
                    title: '角色档案详情',
                    keywords: ['基础设定', '阶段性人设', '开场白', '好感'],
                    blocks: [
                        { type: 'p', text: '角色详情聚合角色的核心信息，便于在聊天与副本中复用。' },
                        {
                            type: 'list',
                            items: [
                                '基础设定：角色背景与关键特征。',
                                '阶段性人设：按阶段拆分的人设与变化。',
                                '开场白：用于对话/剧情的开场素材。',
                                '好感显示：用于呈现互动状态与进度。'
                            ]
                        }
                    ]
                },
                {
                    id: 'archive-import-export',
                    title: '导入与导出',
                    keywords: ['导入', '导出', 'json', 'png', '酒馆卡'],
                    blocks: [
                        { type: 'p', text: '档案支持导出为文件，也支持从文件导入角色卡。' },
                        {
                            type: 'list',
                            items: [
                                '导出：以 JSON 形式导出角色数据。',
                                '导入：支持 JSON 与 PNG（酒馆卡）两种格式。',
                                '联动：导入角色后可同步生成对应的世界书与正则分组。'
                            ]
                        }
                    ]
                }
            ]
        },
        {
            category: '副本',
            keywords: ['副本', 'npc', '归档', '小手机', '结算', '文风', '上下文'],
            items: [
                {
                    id: 'instance-overview',
                    title: '副本与副本列表',
                    keywords: ['副本列表', '详情', '封面', '任务', '开场白'],
                    blocks: [
                        { type: 'p', text: '副本是"剧情/任务式对话"的容器：每个副本包含设定、任务、开场白与专属聊天。' },
                        {
                            type: 'list',
                            items: [
                                '副本列表：展示已创建的副本卡片。',
                                '副本详情：包含封面、简介、任务列表与开场白等信息。',
                                '活动会话：副本可记录并恢复当前进行中的会话状态。'
                            ]
                        }
                    ]
                },
                {
                    id: 'instance-settings',
                    title: '副本设置（基础设置）',
                    keywords: ['api 预设', '文风预设', '上下文', '总结'],
                    blocks: [
                        { type: 'p', text: '基础设置用于控制副本的"模型来源、风格与上下文策略"。' },
                        {
                            type: 'list',
                            items: [
                                'API 预设：为单个副本指定使用的 API 配置。',
                                '文风预设：为副本选择一组文风模板。',
                                '上下文记忆：控制读取条数与自动总结阈值。'
                            ]
                        }
                    ]
                },
                {
                    id: 'instance-npc',
                    title: 'NPC 库',
                    keywords: ['npc', '列表', '详情'],
                    blocks: [
                        { type: 'p', text: 'NPC 库用于管理副本可用的 NPC 角色集合，供进入副本时组合参与者。' },
                        {
                            type: 'list',
                            items: [
                                'NPC 列表：展示已创建的 NPC。',
                                'NPC 详情：查看 NPC 的头像、姓名与人设信息。'
                            ]
                        }
                    ]
                },
                {
                    id: 'instance-phone',
                    title: '副本内"小手机"',
                    keywords: ['小手机', '联系人', '手机聊天', '未读'],
                    blocks: [
                        { type: 'p', text: '副本内包含"小手机"模拟器：提供副本专用联系人与手机聊天，会被纳入副本上下文。' },
                        {
                            type: 'list',
                            items: [
                                '手机联系人：副本内独立的联系人体系。',
                                '手机聊天：独立消息流与输入区。',
                                '未读提示：工具栏可提示手机未读状态。'
                            ]
                        }
                    ]
                },
                {
                    id: 'instance-archive',
                    title: '归档与结算',
                    keywords: ['归档', '结算', '回顾', '奖励'],
                    blocks: [
                        { type: 'p', text: '副本支持归档与结算：将完整记录与结果保存为可回顾的档案。' },
                        {
                            type: 'list',
                            items: [
                                '归档副本：保存聊天记录与结算数据。',
                                '归档列表：按条目展示已归档内容。',
                                '回顾：在归档结算页查看历史对话与结果。'
                            ]
                        }
                    ]
                }
            ]
        },
        {
            category: '记忆',
            keywords: ['记忆', '收藏', '聊天', '帖子', '相册'],
            items: [
                {
                    id: 'memory-tabs',
                    title: '记忆的结构',
                    keywords: ['tab', '聊天', '帖子', '相册'],
                    blocks: [
                        { type: 'p', text: '记忆模块按内容类型分为三个区域：聊天 / 帖子 / 相册。' },
                        {
                            type: 'list',
                            items: [
                                '聊天：收藏馆，用于保存与角色的高价值片段。',
                                '帖子：预留为帖子型内容的收藏与整理（待完善）。',
                                '相册：预留为图片型内容的整理（待完善）。'
                            ]
                        }
                    ]
                },
                {
                    id: 'memory-chat',
                    title: '聊天收藏馆',
                    keywords: ['收藏', '详情', '语音', '心声'],
                    blocks: [
                        { type: 'p', text: '聊天收藏馆以卡片形式展示收藏条目，并提供收藏详情页。' },
                        {
                            type: 'list',
                            items: [
                                '收藏卡片：包含角色信息、消息条数与时间。',
                                '收藏详情：以消息流方式展示文本/图片/语音/引用等内容。',
                                '扩展内容：部分消息可关联"心声"数据与语音播放。'
                            ]
                        }
                    ]
                }
            ]
        },
        {
            category: '商城',
            keywords: ['商城', '分类', '购物车', '钱包', '物流', '背包', '黑市'],
            items: [
                {
                    id: 'mall-browse',
                    title: '商品与分类',
                    keywords: ['food', 'coffee', 'clothes', 'commodity', 'gifts', 'play', 'speakeasy'],
                    blocks: [
                        { type: 'p', text: '商城按分类组织商品，并以网格方式浏览与选择。' },
                        {
                            type: 'list',
                            items: [
                                '分类：FOOD / COFFEE / CLOTHES / COMMODITY / GIFTS / PLAY / SPEAKEASY（黑市）。',
                                '商品卡：名称、描述与价格信息。',
                                '货币体系：常规分类使用余额（￥），黑市使用积分（∅）。'
                            ]
                        }
                    ]
                },
                {
                    id: 'mall-cart',
                    title: '购物车与结算',
                    keywords: ['购物车', '结算', '总价'],
                    blocks: [
                        { type: 'p', text: '购物车用于汇总已选商品，并提供结算视图。' },
                        {
                            type: 'list',
                            items: [
                                '购物车清单：展示商品项、数量与合计。',
                                '结算：生成购买结果并与钱包/物流联动。',
                                '规则：购物车不混用两种结算方式（余额/积分需分开）。'
                            ]
                        }
                    ]
                },
                {
                    id: 'mall-wallet-bag',
                    title: '钱包 / 物流 / 背包',
                    keywords: ['钱包', '余额', '积分', '流水', '物流', '背包'],
                    blocks: [
                        { type: 'p', text: '商城包含资产与结果展示区域，用于呈现"购买前后"的状态变化。' },
                        {
                            type: 'list',
                            items: [
                                '钱包：余额（￥）与积分（∅）卡片，以及明细流水。',
                                '物流：订单与物流条目列表。',
                                '背包：展示已获得/已购买的物品集合。'
                            ]
                        }
                    ]
                },
                {
                    id: 'mall-generate',
                    title: '生成与录入',
                    keywords: ['生成', '录入', 'ai'],
                    blocks: [
                        { type: 'p', text: '商城支持扩展商品池：可以生成商品，也可以手动录入。' },
                        {
                            type: 'list',
                            items: [
                                '生成：按分类生成一定数量的商品，写入本地商品池。',
                                '录入：手动添加商品信息（包含分类与价格规则）。'
                            ]
                        }
                    ]
                }
            ]
        },
        {
            category: '论坛',
            keywords: ['论坛', '帖子', '评论', '生成', '个人主页', '绑定角色', '切换论坛'],
            items: [
                {
                    id: 'forum-feed',
                    title: '首页与帖子流',
                    keywords: ['feed', '帖子流', '互动'],
                    blocks: [
                        { type: 'p', text: '论坛以信息流形式展示帖子，并提供互动区与详情页。' },
                        {
                            type: 'list',
                            items: [
                                '帖子结构：标题（可选）、正文、标签、图片预览与互动按钮。',
                                '帖子详情：展示完整内容与评论区。',
                                '高亮规则：可读取正则规则对正文进行命中高亮。'
                            ]
                        }
                    ]
                },
                {
                    id: 'forum-post',
                    title: '发帖与生成',
                    keywords: ['发帖', '匿名', '图片', '标签', '生成'],
                    blocks: [
                        { type: 'p', text: '论坛提供内容发布与内容生成两类能力。' },
                        {
                            type: 'list',
                            items: [
                                '发帖：标题（可选）、正文、图片、标签与匿名选项。',
                                '生成：批量生成帖子与评论，并写入本地存储。'
                            ]
                        }
                    ]
                },
                {
                    id: 'forum-profile',
                    title: '个人主页与论坛菜单',
                    keywords: ['个人主页', '背景', '绑定角色', '切换论坛', '积分排名'],
                    blocks: [
                        { type: 'p', text: '论坛菜单用于管理身份与论坛环境。' },
                        {
                            type: 'list',
                            items: [
                                '个人主页：头像、昵称、个签与主页背景。',
                                '绑定角色：把档案角色绑定到论坛身份（用于口吻与生成）。',
                                '切换论坛：在不同论坛之间切换与管理。',
                                '暗网论坛：包含积分排名等扩展视图。'
                            ]
                        }
                    ]
                }
            ]
        },
        {
            category: '音乐',
            keywords: ['音乐', '歌单', '搜索', '播放', '歌词'],
            items: [
                {
                    id: 'music-tabs',
                    title: '模块结构',
                    keywords: ['我的', '搜索', '播放'],
                    blocks: [
                        { type: 'p', text: '音乐模块包含三页结构：我的 / 搜索 / 播放。' },
                        {
                            type: 'list',
                            items: [
                                '我的：个人卡片与本地歌单列表。',
                                '搜索：用于搜索歌曲（含外部来源适配）。',
                                '播放：播放器页，展示当前曲目与播放状态。'
                            ]
                        }
                    ]
                },
                {
                    id: 'music-playlist',
                    title: '歌单体系',
                    keywords: ['歌单', '收藏', '封面'],
                    blocks: [
                        { type: 'p', text: '歌单用于组织本地收藏的歌曲集合，并支持歌单信息维护。' },
                        {
                            type: 'list',
                            items: [
                                '歌单列表：新建歌单与已创建歌单卡片。',
                                '歌单详情：展示歌曲列表与歌单信息。',
                                '收藏到歌单：把歌曲归入指定歌单。'
                            ]
                        }
                    ]
                },
                {
                    id: 'music-player',
                    title: '播放与歌词',
                    keywords: ['播放', '链接', '歌词', '同步'],
                    blocks: [
                        { type: 'p', text: '播放器负责播放控制、链接获取与歌词展示，并与主屏小组件联动。' },
                        {
                            type: 'list',
                            items: [
                                '播放控制：当前曲目与播放状态管理。',
                                '歌词：获取与解析歌词，并随播放进度更新。',
                                '主屏联动：同步歌名、封面与播放状态到主屏组件。'
                            ]
                        }
                    ]
                }
            ]
        },
        {
            category: '查手机',
            keywords: ['查手机', '手机模拟器', '壁纸', '浏览器', '钱包', '健康', '微博', '日记', '监控', '副本', '往事'],
            items: [
                {
                    id: 'phone-overview',
                    title: '手机模拟器概览',
                    keywords: ['联系人', '壁纸', '主屏'],
                    blocks: [
                        { type: 'p', text: '查手机模块是"联系人手机"的模拟器：每个联系人可拥有独立的手机主屏与应用内容。' },
                        {
                            type: 'list',
                            items: [
                                '联系人入口：以联系人为维度进入对应手机。',
                                '壁纸：按联系人保存不同壁纸方案。',
                                '应用容器：各应用在同一页面容器内切换渲染。'
                            ]
                        }
                    ]
                },
                {
                    id: 'phone-apps',
                    title: '内置应用列表',
                    keywords: ['设置', '聊天', '相册', '备忘录', '浏览器', '钱包', '健康', '微博', '日记', '监控', '副本', '往事'],
                    blocks: [
                        { type: 'p', text: '手机主屏包含一组内置应用入口，覆盖内容阅读、记录与生成类能力。' },
                        {
                            type: 'list',
                            items: [
                                '设置：手机壁纸等基础外观设置。',
                                '聊天 / 相册 / 备忘录：内容入口（按联系人维度组织）。',
                                '浏览器：搜索框与页面列表容器。',
                                '钱包：余额与账单流水展示。',
                                '健康：健康卡片与详情视图（含数据占位引导）。',
                                '微博：主号/小号信息流与刷新生成。',
                                '日记：日记列表与全屏阅读详情，包含阅读设置（背景/字体/字号/页边距）。',
                                '监控：统计类面板（例如计数与概览）。',
                                '副本 / 往事：阅读类内容入口与刷新生成。'
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    const inlineToFragment = (text) => {
        const frag = document.createDocumentFragment();
        const raw = (text || '').toString();
        const re = /「([^」]+)」|\{accent:([^}]+)\}|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
        let last = 0;
        for (const m of raw.matchAll(re)) {
            const idx = m.index ?? 0;
            if (idx > last) {
                frag.appendChild(document.createTextNode(raw.slice(last, idx)));
            }
            let node = null;
            if (m[1] != null) {
                node = document.createElement('span');
                node.className = 'tutorial-inline-ui';
                node.textContent = m[1];
            } else if (m[2] != null) {
                node = document.createElement('span');
                node.className = 'tutorial-inline-accent';
                node.textContent = m[2];
            } else if (m[3] != null) {
                node = document.createElement('strong');
                node.textContent = m[3];
            } else if (m[4] != null) {
                node = document.createElement('em');
                node.textContent = m[4];
            }
            if (node) frag.appendChild(node);
            last = idx + m[0].length;
        }
        if (last < raw.length) {
            frag.appendChild(document.createTextNode(raw.slice(last)));
        }
        return frag;
    };

    const renderBlock = (block) => {
        const wrap = document.createElement('div');
        wrap.className = 'tutorial-block';
        if (block.type === 'p') {
            const p = document.createElement('div');
            p.appendChild(inlineToFragment(block.text));
            wrap.appendChild(p);
            return wrap;
        }
        if (block.type === 'list') {
            const ul = document.createElement('ul');
            ul.style.margin = '0';
            ul.style.paddingLeft = '18px';
            ul.style.display = 'flex';
            ul.style.flexDirection = 'column';
            ul.style.gap = '6px';
            (block.items || []).forEach((itemText) => {
                const li = document.createElement('li');
                li.appendChild(inlineToFragment(itemText));
                ul.appendChild(li);
            });
            wrap.appendChild(ul);
            return wrap;
        }
        if (block.type === 'quote') {
            const q = document.createElement('div');
            q.className = 'tutorial-quote';
            q.appendChild(inlineToFragment(block.text));
            wrap.appendChild(q);
            return wrap;
        }
        if (block.type === 'callout') {
            const c = document.createElement('div');
            c.className = 'tutorial-callout';
            const t = document.createElement('div');
            t.className = 'tutorial-callout-title';
            t.textContent = block.title || '提示';
            const b = document.createElement('div');
            b.appendChild(inlineToFragment(block.text));
            c.appendChild(t);
            c.appendChild(b);
            wrap.appendChild(c);
            return wrap;
        }
        return wrap;
    };

    const buildIndex = (data) => {
        const list = [];
        const processItems = (items, category) => {
            (items || []).forEach((item) => {
                const key = normalize(
                    [category, ...(item.keywords || []), item.title].join(' ')
                );
                list.push({
                    category: category,
                    id: item.id,
                    title: item.title,
                    key
                });
                // 递归处理子项目
                if (item.children) {
                    processItems(item.children, category);
                }
            });
        };
        data.forEach((cat) => {
            processItems(cat.items, cat.category);
        });
        return list;
    };

    const index = buildIndex(tutorialData);

    const render = () => {
        contentEl.innerHTML = '';
        tutorialData.forEach((cat) => {
            const details = document.createElement('details');
            details.className = 'tutorial-category';
            details.dataset.category = cat.category;

            const summary = document.createElement('summary');
            summary.className = 'tutorial-summary';
            const left = document.createElement('div');
            left.textContent = cat.category;
            summary.appendChild(left);

            const body = document.createElement('div');
            body.className = 'tutorial-category-body';

            const renderItems = (items, parentBody) => {
                (items || []).forEach((item) => {
                    const itemDetails = document.createElement('details');
                    itemDetails.className = 'tutorial-item';
                    itemDetails.id = `tutorial-item-${item.id}`;
                    itemDetails.dataset.itemId = item.id;
                    itemDetails.dataset.category = cat.category;

                    const itemSummary = document.createElement('summary');
                    itemSummary.className = 'tutorial-summary';
                    const itemLeft = document.createElement('div');
                    itemLeft.textContent = item.title;
                    itemSummary.appendChild(itemLeft);

                    const itemBody = document.createElement('div');
                    itemBody.className = 'tutorial-item-body';
                    (item.blocks || []).forEach((block) => {
                        itemBody.appendChild(renderBlock(block));
                    });

                    itemDetails.appendChild(itemSummary);
                    itemDetails.appendChild(itemBody);
                    parentBody.appendChild(itemDetails);

                    // 递归渲染子项目
                    if (item.children) {
                        const childrenContainer = document.createElement('div');
                        childrenContainer.className = 'tutorial-children';
                        childrenContainer.style.paddingLeft = '20px';
                        renderItems(item.children, childrenContainer);
                        itemBody.appendChild(childrenContainer);
                    }
                });
            };

            renderItems(cat.items, body);

            details.appendChild(summary);
            details.appendChild(body);
            contentEl.appendChild(details);
        });
    };

    const setSuggestVisible = (visible) => {
        suggest.classList.toggle('visible', visible);
        suggest.setAttribute('aria-hidden', visible ? 'false' : 'true');
    };

    const clearSuggest = () => {
        suggest.innerHTML = '';
        setSuggestVisible(false);
    };

    const openToItem = (catName, itemId) => {
        const categoryDetails = [...contentEl.querySelectorAll('details.tutorial-category')].find(
            (d) => d.dataset.category === catName
        );
        if (categoryDetails) categoryDetails.open = true;

        const itemDetails = document.getElementById(`tutorial-item-${itemId}`);
        if (itemDetails && itemDetails.tagName.toLowerCase() === 'details') {
            itemDetails.open = true;
            // 展开所有父级元素
            let parent = itemDetails.parentElement;
            while (parent) {
                if (parent.tagName.toLowerCase() === 'details') {
                    parent.open = true;
                }
                parent = parent.parentElement;
            }
            itemDetails.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const onSearch = () => {
        const q = normalize(searchInput.value);
        if (!q) {
            clearSuggest();
            return;
        }
        const terms = q.split(/\s+/g).filter(Boolean);
        const matches = index
            .filter((it) => terms.every((t) => it.key.includes(t)))
            .slice(0, 8);
        suggest.innerHTML = '';
        matches.forEach((m) => {
            const row = document.createElement('div');
            row.className = 'tutorial-suggest-item';
            row.dataset.itemId = m.id;
            row.dataset.category = m.category;

            const title = document.createElement('div');
            title.className = 'tutorial-suggest-title';
            title.textContent = m.title;
            const sub = document.createElement('div');
            sub.className = 'tutorial-suggest-subtitle';
            sub.textContent = m.category;

            row.appendChild(title);
            row.appendChild(sub);
            row.addEventListener('click', () => {
                clearSuggest();
                openToItem(m.category, m.id);
            });
            suggest.appendChild(row);
        });
        setSuggestVisible(matches.length > 0);
    };

    const openSheet = () => {
        overlay.classList.add('visible');
        overlay.setAttribute('aria-hidden', 'false');
        openBtn.setAttribute('aria-expanded', 'true');
        searchInput.focus({ preventScroll: true });
    };

    const closeSheet = () => {
        overlay.classList.remove('visible');
        overlay.setAttribute('aria-hidden', 'true');
        openBtn.setAttribute('aria-expanded', 'false');
        clearSuggest();
        searchInput.value = '';
    };

    openBtn.addEventListener('click', () => {
        openSheet();
    });

    closeBtn.addEventListener('click', () => {
        closeSheet();
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeSheet();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('visible')) {
            closeSheet();
        }
    });

    searchInput.addEventListener('input', onSearch);
    searchInput.addEventListener('focus', onSearch);
    searchInput.addEventListener('blur', () => {
        setTimeout(() => clearSuggest(), 120);
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const first = suggest.querySelector('.tutorial-suggest-item');
            if (first) {
                e.preventDefault();
                first.click();
            }
        }
    });

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            onSearch();
            const first = suggest.querySelector('.tutorial-suggest-item');
            if (first) {
                first.click();
            }
        });
    }

    render();
})();
