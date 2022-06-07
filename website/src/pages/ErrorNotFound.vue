<script lang="ts" setup>
// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="fullscreen text-white text-center q-pa-md flex flex-center">
        <div>
            <div style="font-size: 30vh">
                404
            </div>

            <div class="text-h2" style="opacity:.4">
                Oops. Nothing here...
            </div>

            <q-btn class="q-mt-xl" color="white" label="Go Home" no-caps text-color="primary" to="/" unelevated/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.fullscreen {
    background: $primary;
    background: radial-gradient(circle, #{ $primary } 0%, #{ $secondary } 100%);
}
</style>