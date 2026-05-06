<template>
  <div class="max-w-2xl mx-auto py-8 space-y-8">
    <h1 class="text-2xl font-semibold">Push Setup</h1>

    <div class="space-y-4 text-sm">
      <p class="text-muted-foreground">
        Push widgets (e.g. Server Stats, NAS Stats) receive data from external scripts via HTTP.
        You create a token per widget and send data to the ingest endpoint.
      </p>

      <div class="space-y-2">
        <h2 class="font-medium text-base">1. Create a token</h2>
        <p class="text-muted-foreground">
          Go to <NuxtLink to="/settings/tokens" class="underline hover:text-foreground">Tokens</NuxtLink>,
          select the widget you want to push data to, set a label and expiry date, then click <em>Create token</em>.
          Copy the token immediately — it won't be shown again.
        </p>
      </div>

      <div class="space-y-2">
        <h2 class="font-medium text-base">2. Send data</h2>
        <p class="text-muted-foreground">POST your payload as JSON to:</p>
        <code class="block bg-muted rounded px-3 py-2 text-xs break-all">
          POST {{ baseUrl }}/api/ingest/&lt;your-token&gt;
        </code>
        <p class="text-muted-foreground">Example with curl:</p>
        <pre class="bg-muted rounded px-3 py-2 text-xs overflow-x-auto">curl -X POST {{ baseUrl }}/api/ingest/&lt;your-token&gt; \
  -H "Content-Type: application/json" \
  -d '{"cpu": 12, "ram": 45, "disk": 67}'</pre>
      </div>

      <div class="space-y-2">
        <h2 class="font-medium text-base">3. Automate with a cron job</h2>
        <p class="text-muted-foreground">On Linux/NAS, add a cron entry to push regularly:</p>
        <pre class="bg-muted rounded px-3 py-2 text-xs overflow-x-auto">* * * * * curl -s -X POST {{ baseUrl }}/api/ingest/&lt;your-token&gt; \
  -H "Content-Type: application/json" \
  -d "{\"cpu\": $(top -bn1 | awk '/Cpu/ {print 100-$8}')}"</pre>
      </div>

      <div class="space-y-2">
        <h2 class="font-medium text-base">Notes</h2>
        <ul class="list-disc list-inside text-muted-foreground space-y-1">
          <li>Tokens are bound to a specific widget — one token per widget.</li>
          <li>The payload structure depends on what the widget expects.</li>
          <li>Expired tokens are automatically rejected.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'settings' })

const baseUrl = import.meta.client ? window.location.origin : ''
</script>
