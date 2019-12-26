## Special thanks to Ms.Kawahara AND leprachaun.inc

# marec-2019

> leplab-2018-to-2019

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate

# deploy
$ firebase deploy
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## 基本的なことのお勉強

[君はまだ平成のアーキテクチャを使ってるのか？僕は Firebase と令和の時代に行くぞ。](https://qiita.com/hecateball/items/c55b6811835923fb9574)
[Nuxt.js + Firebase Authentication + FireStore で web アプリケーションハンズオン](https://qiita.com/ririli/items/d0d3a6ae78c1b6e827fc)

## ざっくり解説

このプロジェクトは、PWA ならこのくらいまではスマホアプリっぽいことができるよ、という例として参考にしてください。
たたき台としてコピるもよし、イチからやってみて詰まったときに参照するもよし。

今回の構成は、Nuxt(SPA、Vuetify) + Firebase Authentication + FireStore です。

もともとの要件（レプラボ）を整理すると、
「写真＋文字データの CMS」をスマホアプリで…ということなので、要は掲示板みたいなものです。
ログイン機能と、データの CRUD ができればよし。

伊藤オリジナル要件として、スマホアプリでなく PWA で挑みました。
画像や文字を端末に保存しておけば、家の中で通信状態が悪い場所があっても機能するでしょ、という発想です。
通信結果等が端末にキャッシュされるため、動作がまぁまぁ早い and サーバー料金が発生しにくいです。

セットアップ手順なんかは Nuxt ＋ PWA 界隈に結構あるので省略します。
ただググって同じようにやっても上手く行かなかったり、ベストな方法でないことがよくあります。
公式ドキュメントにも書いてなくて、[ブログ](https://firebase.googleblog.com/)のほうに書いてあるのは GCP 界隈あるある。

## やってみたけど失敗だったこと、やらなかったこと

・Twitter や Facebook でのログイン
　　　 FirebaseUI を使えばアリモノでサッと作れますが、頑張って API キー取得するの面ど…無駄にリッチにする必要ないなと気づいたのでやめました。
　　　 Firebase が Google の製品で助かった。Google 認証は速攻で作れました。

・SSR
　　　 Cloud Functions や、GAE/Node.js を使うとできますが、
　　　 無料で使ってるスペックだと流石に利点を感じられなかったのでやめました。
　　　 SEO 対策するでなし。

・「設備」「整備」履歴の管理用項目の増加
　　　 最初は価格.com のスペック情報くらい要素を追加してたんですが、
　　 　テストで使ってみて、そんなガッツリ書く？いやなんとなくわかればいいでしょ…
　　 　と思って、メモ欄だけにしました。
　　 　ユーザーストーリー大事。

・DB 設計
　　　 セキュリティルールで、コレクションへのアクセスをユーザー ID で縛った（チュートリアル通り）
　　 　これの問題は、ユーザーを横断して検索できないこと。
　　 　家族で１つの家電の情報を見るとか考えると、↓ の方法のほうが良かった。
　　 　１．ドキュメント（≒ レコード）は全部縦に並べる
　　 　２．「auther」「users」みたいなフィールドを作る
　　 　３．検索時は auther での検索と users での検索を２つ走らせる
　　 　４．セキュリティルールはフィールドを参照する

## 詰まりどころ

・環境構築
　　　たぶん Windows だけだけど、Anaconda が入っていると Firebase CLI がエラー止まりする。

・そもそも Firebase は何がキャッシュできるんだ
　　　結論としては、
　　　１．ログイン情報
　　　２．Firestore への送信予約と、受信したデータ
　　　３．Firestore から受信したファイル
　　　はキャッシュできる。
　　　 Firestore への送信は素直にはキャッシュできないので、
　　　一度 Firestore に入れるとか小手先で頑張る必要がある。
　　　伊藤は諦めました。

・文字情報と画像の紐付け
　　　 Firestore ならではの悩みで、
　　　端末から DB と Storage に別々に格納に行く必要がある。
　　　一度に送信したければ Cloud Functions なりの API を使うことになるが、
　　　オフライン対応（と、Firestore の練習）を優先させたので、
　　　文字情報送信で、終わったことを確認（listen に modified 通知が来る）してから Storage に格納に行っている。

・認証情報チェック
　　　 middleware/auth.js 　参照のこと。
　　　ブログ・記事など、人によって書き方がまちまちで悩む。
　　　 PWA であれば、初回起動時には必ずルートにつながるので、
　　　ぐるぐる表示で認証情報がキャッシュされているかの確認が終わるのを待たないと、
　　　ユーザーはすぐログインボタンを押下して再認証に入ってしまう。
　　　「やってみた」程度の Qiita 記事あたりだとここまでは出てこない。

・Firestore のデータ構造
　　　たぶん苦しんで覚えろ的な話。
　　　使わないと何を読んでもさっぱり納得できない。

・Firebase Storage に入れた画像をキャッシュさせる
　　　送信時（後付けでもできる）metadata を設定すればいいのだが、それがチュートリアルに書いていない。
　　　ついでに、Firebase のコンソールで見ても「その他のメタデータ無し」表示にしかならないのには参った。

・写真を撮る
　　　 components\PhotoCard.vue 　を参照のこと。
　　　写真を撮って送信する…までは楽だが、カメラとの接続を切るのにハマった。
　　　なんだ stream って。
　　　完成品のソースを見ればすぐに分かるのだが、あまり例が転がっていない。
