module.exports = {
  title: "渔网的收获",
  description: "",
  markdown: {
    lineNumbers: true
  },
  base: '/',
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
            'react-native',
            // 'react-native-principle',
            'react-native-bridge'
          ]
        },
        {
          title: 'HTML/CSS',
          collapsable: false,
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
            'arith-time',
            'arith-array'
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
            'arith-source-drag'
          ]
        }
      ],
      // '/interview/':[],
      '/book/':[
        {
          title: "技术相关",
          collapsable: false,
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
