<template>
  <div class="qr-display-page">
    <QRCodeDisplay />
  </div>
</template>

<script setup lang="ts">
import { QRCodeDisplay } from '../../components/Common';
</script>

<style scoped>
.qr-display-page {
  height: 100vh;
  width: 100%;
}
</style> 