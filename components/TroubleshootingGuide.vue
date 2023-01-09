<template>
  <div class="container">
    <div class="section">
      <div class="columns is-centered">
        <div class="column is-half">
          <h1 class="is-size-3">Store POS unconfigured</h1>
          <p class="pb-2">Unable to access Merchants API. Is it running?</p>
          <b-collapse :open="false" aria-id="contentIdForA11y1">
            <template #trigger="props">
              <b-button
                label="Error details"
                type="is-info"
                aria-controls="contentIdForA11y1"
                :aria-expanded="props.open"
              />
            </template>
            <div class="notification">
              <div class="content">
                <code>{{ $store.state.apiError }}</code>
              </div>
            </div>
          </b-collapse>
          <p class="pt-3">
            Check out
            <a
              href="https://docs.bitcartcc.com/support-and-community/troubleshooting-an-issue"
              target="_blank"
              >this guide</a
            >
            for more information on how to troubleshoot the issue.
          </p>
          <p class="text-h6">
            Quick steps to try:<br />
            1. Ensure merchants API is running. If you are developing locally,
            BitcartCC assumes it is running on port 8000 by default.<br />
            2. Make sure <code>BITCART_ADMIN_API_URL</code> is set to the
            correct URL.<br />
            3. If you are using BitcartCC with ssl enabled, Merchants API's ssl
            certificate might not have been generated yet. Please retry a bit
            later.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
