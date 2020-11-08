/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "bf6acd7430bcc1e93e6187f272ca1b7d"
  },
  {
    "url": "arith/arith-array.html",
    "revision": "e94c407d28b2021a04bda6e82f9f64bb"
  },
  {
    "url": "arith/arith-basic.html",
    "revision": "6dcce07dab83d11f1cc9cf20aa8de558"
  },
  {
    "url": "arith/arith-source-call-bind-apply.html",
    "revision": "c64adc9d22a1c93095fa9310e42557e9"
  },
  {
    "url": "arith/arith-source-debounce-throttle.html",
    "revision": "f9dd0009f9cea3777aa38dacc3ebb9b9"
  },
  {
    "url": "arith/arith-source-drag.html",
    "revision": "5885edf574298cae751b6ba4ecfda5a9"
  },
  {
    "url": "arith/arith-source-emitter.html",
    "revision": "d65c7bdb7daf34d9d29e4a266e6713a7"
  },
  {
    "url": "arith/arith-source-new.html",
    "revision": "98c3292b25424514c394c0d1957fdf4f"
  },
  {
    "url": "arith/arith-source-parse-stringify.html",
    "revision": "5fa8249d5019d7b5238040477c4cc78e"
  },
  {
    "url": "arith/arith-time.html",
    "revision": "32683f5c183fa53e32747bd323e93cb5"
  },
  {
    "url": "arith/arith-written-everyDay.html",
    "revision": "fe74052b05f066f4a59b30d159666331"
  },
  {
    "url": "arith/index.html",
    "revision": "14d96fbf7532dac8c0a343e168d8845d"
  },
  {
    "url": "assets/css/0.styles.f85f523a.css",
    "revision": "2215f82e28cc5408f4c946e26348e7b3"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.81c55362.js",
    "revision": "37eaa2125cd680fd1870bebd31404de5"
  },
  {
    "url": "assets/js/11.a8961898.js",
    "revision": "84760209ae86e43f07514c416fd27d27"
  },
  {
    "url": "assets/js/12.27d273d8.js",
    "revision": "911815e0399550fd07d0e51417dadf63"
  },
  {
    "url": "assets/js/13.17b526ee.js",
    "revision": "fd2cd99ae0106735a549b6a4b4bdb7f2"
  },
  {
    "url": "assets/js/14.9fb9f1f6.js",
    "revision": "32dfa9609032ddacbc6e2f9c9a51ebbc"
  },
  {
    "url": "assets/js/15.68809f88.js",
    "revision": "e495d3e6cfec37aab2a6bc359fb19180"
  },
  {
    "url": "assets/js/16.aba76e28.js",
    "revision": "9deea1e080df8ff726a9c2f75d04f7ff"
  },
  {
    "url": "assets/js/17.935024df.js",
    "revision": "d48ae9802c560484dc1272480a83232a"
  },
  {
    "url": "assets/js/18.87e02b1b.js",
    "revision": "2095c9fb57403a7874a3365e0e3b1e46"
  },
  {
    "url": "assets/js/19.9ce88a57.js",
    "revision": "70c3233d4f557d19f6484188eb1e016e"
  },
  {
    "url": "assets/js/2.55845630.js",
    "revision": "57a958d4d515acda9a2542423c8aee2c"
  },
  {
    "url": "assets/js/20.153bc889.js",
    "revision": "e7cb658c1c8b0c38eb8db9bcb213417f"
  },
  {
    "url": "assets/js/21.c6d8215f.js",
    "revision": "cd72f22fc1c15d62fccff8b324ade713"
  },
  {
    "url": "assets/js/22.1e61390a.js",
    "revision": "1469673a7decf053b5616bf18a8ced68"
  },
  {
    "url": "assets/js/23.7ec11354.js",
    "revision": "fbf87fb4a07c43b95446ec5bdd1e55a9"
  },
  {
    "url": "assets/js/24.9cb6f350.js",
    "revision": "81e65ab221491df2c55eb6f033a29dbb"
  },
  {
    "url": "assets/js/25.26af678e.js",
    "revision": "0e41bce46847e43cfb0c8aa9582fcf02"
  },
  {
    "url": "assets/js/26.257a042b.js",
    "revision": "61bfe043669cc9236256fb893a57a82c"
  },
  {
    "url": "assets/js/27.7b4ab38d.js",
    "revision": "49bc28786b284ff060779b04323fbd6d"
  },
  {
    "url": "assets/js/28.e64b7c0b.js",
    "revision": "7895f52e6ab051b6c2e57d4d748d0dbc"
  },
  {
    "url": "assets/js/29.0979406b.js",
    "revision": "34316bab08bc57ea490fe5668f7baaf0"
  },
  {
    "url": "assets/js/3.e0f79c9f.js",
    "revision": "050b17d109d2ca355baa2aa70261e0e4"
  },
  {
    "url": "assets/js/30.fe5a4276.js",
    "revision": "a08d364adec5fef63de8e0143cd6ac21"
  },
  {
    "url": "assets/js/31.797bcde4.js",
    "revision": "e67cf3b6f420087788c6e9d8ca84c85e"
  },
  {
    "url": "assets/js/32.3cfb5af5.js",
    "revision": "ef8717cf112ebc46b9176d3d972caf0f"
  },
  {
    "url": "assets/js/33.621a195e.js",
    "revision": "bf226f169960215db62cf28159eae498"
  },
  {
    "url": "assets/js/34.a17ff68f.js",
    "revision": "78fd204052a060e2a958dde3807f96f3"
  },
  {
    "url": "assets/js/35.98958db5.js",
    "revision": "bb05663247102095c7b13732df35c84d"
  },
  {
    "url": "assets/js/36.9d8c8f04.js",
    "revision": "95280a2211e01dee2ecf5df762b5f107"
  },
  {
    "url": "assets/js/37.14e93bdb.js",
    "revision": "6dd3dbb08698d980bc6ba25525d25e39"
  },
  {
    "url": "assets/js/38.13542f75.js",
    "revision": "be9b7948daaf09f966b2c31a2e151a42"
  },
  {
    "url": "assets/js/4.7c53c391.js",
    "revision": "0a701ec4555362dd2173d86f838026fa"
  },
  {
    "url": "assets/js/5.d6b23f0c.js",
    "revision": "08bb04eceffc1552b4276419014c5c0a"
  },
  {
    "url": "assets/js/6.da3f1227.js",
    "revision": "e507a9171896382e676fb2d30e2341a8"
  },
  {
    "url": "assets/js/7.2b2bf1e6.js",
    "revision": "5a162b7953608361705061791a5a0e63"
  },
  {
    "url": "assets/js/8.a9d9e867.js",
    "revision": "fe9b4648660516c00d083dbd187bbd88"
  },
  {
    "url": "assets/js/9.79800cc0.js",
    "revision": "4568251d082be4860795fd19afe6dd62"
  },
  {
    "url": "assets/js/app.596f9c08.js",
    "revision": "905e88c7ee6f4666d9f805a40bcfe48a"
  },
  {
    "url": "blog/basis-ts1.html",
    "revision": "64807fd80c7bfe829b2dc95929448020"
  },
  {
    "url": "blog/basis-ts2.html",
    "revision": "18892503fbd19c118359985e92480714"
  },
  {
    "url": "blog/expand-browser.html",
    "revision": "e08c6c6dbcf382d4308590ae7e43c3a3"
  },
  {
    "url": "blog/index.html",
    "revision": "cf89d9222bc393481e80544d9adf8543"
  },
  {
    "url": "blog/internet-http.html",
    "revision": "685a39981159b25176d99199e8ea4ad1"
  },
  {
    "url": "blog/internet-https.html",
    "revision": "9cdedbf854695810234d30985193aea2"
  },
  {
    "url": "blog/internet-movement.html",
    "revision": "070a654b480b474653dc8580bfe3f953"
  },
  {
    "url": "blog/internet-osi.html",
    "revision": "55394fcbd46c001715aae85e4627030f"
  },
  {
    "url": "blog/internet-tcp.html",
    "revision": "8f7fc212c7ba3dd4a419a4d8c4b8a577"
  },
  {
    "url": "blog/js-undefined-null.html",
    "revision": "7222d11341eaff13eca8bedafcecea0c"
  },
  {
    "url": "blog/react-library-core.html",
    "revision": "aa98952d2bd2231282cabc94606af62c"
  },
  {
    "url": "blog/react-library.html",
    "revision": "cb6e26e5279cb08d68268e7e5c1def7d"
  },
  {
    "url": "blog/react-native-bridge.html",
    "revision": "f8b30c8f7a431d132b7031159eff9c85"
  },
  {
    "url": "blog/react-native-principle.html",
    "revision": "1686dff5b84ef2e962dd4ec7a1fc3373"
  },
  {
    "url": "blog/react-native.html",
    "revision": "d4bb453ee0a9d635d5d5e6ccee43b5a7"
  },
  {
    "url": "blog/react-source-one.html",
    "revision": "e20554a5135b96055514503f35be4cb7"
  },
  {
    "url": "book/index.html",
    "revision": "29aebba5180f8c5be9c792ef2d085296"
  },
  {
    "url": "images/arith-time.jpg",
    "revision": "3723793cc5c810e9d5b06bc95325bf0a"
  },
  {
    "url": "images/arith-times.jpg",
    "revision": "497a3f120b7debee07dc0d03984faf04"
  },
  {
    "url": "images/basis-ts.png",
    "revision": "05464341024c0050a3b59b1a179f7f7d"
  },
  {
    "url": "images/browser-apply-tree.png",
    "revision": "8e48b77dd48bdc509958e73b9935710e"
  },
  {
    "url": "images/browser-apply.png",
    "revision": "d4e0d29e0dfb4c961f0befe088d7ed78"
  },
  {
    "url": "images/browser-char.jpg",
    "revision": "88bb54b6f8c9e80046a159c619f6f85a"
  },
  {
    "url": "images/browser-dom-tree.png",
    "revision": "125849ec56a3ea98d4b476c66c754f79"
  },
  {
    "url": "images/browser-hiey.png",
    "revision": "a03eb12053aac1ac496b61a424f20119"
  },
  {
    "url": "images/browser-mul-process.png",
    "revision": "b61cab529fa31301bde290813b4587fc"
  },
  {
    "url": "images/browser-process.png",
    "revision": "ce7f8cfe212bec0f53360422e3b03a9e"
  },
  {
    "url": "images/browser-process1.png",
    "revision": "a1bf25036fdac268858059b3aafa1a11"
  },
  {
    "url": "images/browser-process2.png",
    "revision": "d8fe2afbd8ea2d4a8d8cc4bb14c50f28"
  },
  {
    "url": "images/browser-url-to-show.png",
    "revision": "92d73c75308e50d5c06ad44612bcb45d"
  },
  {
    "url": "images/internet-browser.png",
    "revision": "c42d92a173e98dca11d9af57906fe801"
  },
  {
    "url": "images/internet-链接.jpg",
    "revision": "9b1407c77598628cb23af4a1b021f5f5"
  },
  {
    "url": "images/osi-http-0rtt.png",
    "revision": "a81b6efb8af80fb839b1181b210f4a21"
  },
  {
    "url": "images/osi-http-binary_framing_layer.svg",
    "revision": "ae09920e853bee0b21be83f8e770ba01"
  },
  {
    "url": "images/osi-http-duolufuyong-1.png",
    "revision": "29bab6ea23377b0d2fe85a97680600e8"
  },
  {
    "url": "images/osi-http-duolufuyong.png",
    "revision": "8e01bb02ebacabc03da3e79dab7ee8d9"
  },
  {
    "url": "images/osi-http-header_compression.svg",
    "revision": "feb142f82737d148ed5bcefd91915276"
  },
  {
    "url": "images/osi-http-jiami.png",
    "revision": "71b35bce707111d2f81dd87e2024f8bb"
  },
  {
    "url": "images/osi-http-push.svg",
    "revision": "d759887277b266a42c526643285dd244"
  },
  {
    "url": "images/osi-http-streams_messages_frames.svg",
    "revision": "8e6931bb40fc26c511ad15645e7b6113"
  },
  {
    "url": "images/osi-https-hash1.png",
    "revision": "87c69f423d32966c5e0890e0ae0ed637"
  },
  {
    "url": "images/osi-https-hash2.png",
    "revision": "91d4b06df8230a597c054f83dabf5a9b"
  },
  {
    "url": "images/osi-https-tsl.png",
    "revision": "3cbf6a508ade1eb3c3e7e819a48c5c7e"
  },
  {
    "url": "images/osi-https.png",
    "revision": "99291362aca06ef1c282cf0561fd37d4"
  },
  {
    "url": "images/osi-model-process.png",
    "revision": "321aa813db8e03c14ffdbfab4693e1e9"
  },
  {
    "url": "images/osi-model.png",
    "revision": "2af488004591cbc12cd82c44518523de"
  },
  {
    "url": "images/osi-tcp-and-osi.png",
    "revision": "cbcf278bc1c3c6826afd7eb41c3a9caa"
  },
  {
    "url": "images/osi-tcp-arq.png",
    "revision": "a56f5dd37438dbcc059b1b11b3a6ac6c"
  },
  {
    "url": "images/osi-tcp-cancel.png",
    "revision": "9bb6008d0e5d389285bdd5a7f1c914b7"
  },
  {
    "url": "images/osi-tcp-connect.png",
    "revision": "27055efa76010e511c26f44c403116fe"
  },
  {
    "url": "images/osi-tcp-header.png",
    "revision": "77d18b4b741565596e54b545dca60ebe"
  },
  {
    "url": "images/osi-tcp-model.png",
    "revision": "6b7cb90c57e5e858c1da0dd770aaddc5"
  },
  {
    "url": "images/osi-tcp-model1.jpg",
    "revision": "92e3711e57c75de2bcb8a78ca8beec98"
  },
  {
    "url": "images/osi-tcp-resend-congestion-avoidance.png",
    "revision": "ca1f34dc9951e3dd44770620fd900c05"
  },
  {
    "url": "images/osi-tcp-resend.png",
    "revision": "494d24b3f888b61dd1f0e43318698272"
  },
  {
    "url": "images/PerfUtil.png",
    "revision": "38260624d55e2e8ebaca13a16b6090b3"
  },
  {
    "url": "images/react-native-con.jpeg",
    "revision": "f85f8ebd19aba1d9607033b500ef7f9f"
  },
  {
    "url": "images/rn-bridge.jpg",
    "revision": "60eb566b812a49fa945e802abe8dd453"
  },
  {
    "url": "images/rn-new-ui.jpeg",
    "revision": "94ccf0b3be4a9ac6d8aa0258984a6596"
  },
  {
    "url": "images/rn-old-ui.jpeg",
    "revision": "1498d70b553c458f6e1a6b776529399d"
  },
  {
    "url": "images/rn-ui.jpg",
    "revision": "b25cc2248cf5a0511667070449b0f5ef"
  },
  {
    "url": "images/rn-ui1.jpg",
    "revision": "3c2bda3cbff9bc0d02cdaf7dd78b0300"
  },
  {
    "url": "images/TCP:IP协议.jpg",
    "revision": "a819699ee1877c802b1d34f6c6b5e510"
  },
  {
    "url": "images/发布订阅.png",
    "revision": "f5c187fdb2e69da2e139f04451a65097"
  },
  {
    "url": "images/发布订阅和观察者区别.png",
    "revision": "cef953a7a7b9d292b0a16b268c2b22a1"
  },
  {
    "url": "images/算法和数据结构图谱.jpg",
    "revision": "913e0ababe43a2d57267df5c5f0832a7"
  },
  {
    "url": "index.html",
    "revision": "23e202cdf413ae69a9aef920a4209064"
  },
  {
    "url": "interview/index.html",
    "revision": "e6283ed91802c592384059c4209c2287"
  },
  {
    "url": "user.png",
    "revision": "02283340465449e38df426720d927849"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
