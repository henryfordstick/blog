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
        },
        {
          title: 'Framework',
          collapsable: false,
        },
        {
          title: 'HTML/CSS',
          collapsable: false,
        },
        {
          title: 'JavaScript基础',
          collapsable: false,
        },
        {
          title: '工程化',
          collapsable: false,
        },
        {
          title: '编程基础',
          collapsable: false,
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
            'arith-basic'
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
            'arith-source-emitter'
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

  ]
};