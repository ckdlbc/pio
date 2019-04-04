module.exports = {
  base: "/pio/",
  locales: {
    "/": {
      lang: "zh-CN",
      title: "Pio",
      description: "一个智能的前端埋点采集库，支持全埋点、代码埋点、装饰器埋点"
    }
  },
  serviceWorker: true,
  themeConfig: {
    repo: "https://github.com/ckdlbc/pio",
    repoLabel: "GitLab",
    docsDir: "docs",
    locales: {
      "/": {
        label: "简体中文",
        selectText: "选择语言",
        editLinkText: "在 GitHub 上编辑此页",
        nav: [
          {
            text: "指南",
            link: "/guide/"
          },
          {
            text: "API 参考",
            link: "/api/"
          }
        ],
        sidebar: [
          "/installation",
          "/",
          "/guide/",
          {
            title: "核心概念",
            collapsable: false,
            children: [
              "/guide/collection",
              "/guide/routeAnalysis",
              "/guide/autoTrack",
              "/guide/manualTrack"
            ]
          }
        ]
      }
    }
  }
};
