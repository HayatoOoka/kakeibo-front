<template>
  <b-navbar toggleable="lg" type="dark" style="background-color: #563d7c;">
    <b-navbar-brand href="/">家計簿アプリ</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/" exact>ホーム</b-nav-item>
        <b-nav-item to="/Account_List" exact>口座一覧・取引登録</b-nav-item>
        <b-nav-item to="/Account_Registration" exact>口座登録</b-nav-item>
        <b-nav-item to="/Organization-List" exact>グループ</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/login" exact>ログイン</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: 'kakeibo-header'
};
</script>

