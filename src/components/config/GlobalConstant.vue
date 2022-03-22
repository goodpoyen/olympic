<script>
export default {
    APISERVERURL: process.env.VUE_APP_MODEENV === 'dev' ? '/api' : process.env.APISERVERURL
}
</script>