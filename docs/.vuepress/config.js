module.exports = {
  title: "渔网的收获",
  description: "",
  markdown: {
    lineNumbers: true
  },
  head: [
    ['link', { rel: 'icon', href: '/user.png' }]
  ],
  themeConfig:{
    repo: 'henryfordstick',
    nav: [
      {
        text: "博客",
        link: "/blog/",
      },
      {
        text: "算法",
        link: "/arith/",
      },
      // {
      //   text: "面试题",
      //   link: "/interview/",
      // },
      {
        text: "阅读",
        link: "/book/",
      },
    ],
    sidebar: {
      '/blog/':[
        {
          title: '视野拓展',
          collapsable: false,
          children: [
            'expand-browser'
          ]
        },
        {
          title: 'Framework',
          collapsable: false,
          children: [
            'react-library',
            'react-library-core',
            'react-source-one',
            'react-source-two',
            'react-source-three',
            'react-native',
            // 'react-native-principle',
            'react-native-bridge'
          ]
        },
        {
          title: 'HTML/CSS',
          collapsable: false,
          children: [
            'css-bfc',
            'css-extends',
            'css-flex'
          ]
        },
        {
          title: 'JavaScript基础',
          collapsable: false,
          children:[
            'js-undefined-null'
          ]
        },
        {
          title: '网络基础',
          collapsable: false,
          children: [
            'internet-movement',
            'internet-osi',
            'internet-http',
            'internet-https',
            'internet-tcp',
          ]
        },
        {
          title: '编程基础',
          collapsable: false,
          children:[
            'basis-ts1',
            'basis-ts2',
            'basis-design-mode'
          ]
        },
        // {
        //   title: '总结思考',
        //   collapsable: false,
        // }
      ],
      '/arith/':[
        {
          title: "算法知识",
          collapsable: false,
          children: [
            'arith-basic',
            'arith-sorting',
            'arith-time',
            'arith-array'
          ]
        },
        {
          title: "算法公式大全",
          collapsable: false,
          children: [
            'routine-thought'
          ]
        },
        {
          title: "经典算法题",
          collapsable: false,
          children: [
            'arith-written-everyDay'
          ]
        },
        {
          title: "探索源码系列",
          collapsable: false,
          children: [
            'arith-source-debounce-throttle',
            'arith-source-new',
            'arith-source-call-bind-apply',
            'arith-source-parse-stringify',
            'arith-source-emitter',
            'arith-source-drag',
            'arith-source-setInterval',
            'arith-source-create',
            'arith-source-curring',
            'arith-source-instanceof',
            'arith-source-promise',
            'arith-source-promiseall',
            'arith-source-sleep',
            'arith-source-flat',
            'arith-source-copy',
            'arith-source-find'
          ]
        }
      ],
      // '/interview/':[],
      '/book/':[
        {
          title: "《图解 Google V8》",
          // collapsable: false,
          children: [
            'V8-prepared-execution',
            'V8-function',
            'V8-attributes',
            'V8-Functional-expression',
            'V8-proto',
            'V8-scope',
            'V8-typeChange',
            'V8-d8',
            'V8-runtime',
            'V8-machine-code',
            'V8-Stack-heap',
            'V8-closure',
            'V8-bytecode-one'
          ]
        },
        {
          title: "其他",
          collapsable: false,
        }
      ]
    },
    lastUpdated: "更新时间",
    docsDir: "docs",
    editLinks: true,
    editLinkText: "本文源码地址",
  },
  plugins: [
    [
      "@vuepress/pwa",
      {
        serviceWorker: true,
        updatePopup: true,
      },
    ],
    ["@vuepress/medium-zoom", true],
    ["@vuepress/back-to-top", true],
  ]
};
