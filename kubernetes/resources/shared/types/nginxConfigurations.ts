export type NginxConfiguration = {
    'nginx.ingress.kubernetes.io/app-root': string
    'nginx.ingress.kubernetes.io/affinity': 'cookie'
    'nginx.ingress.kubernetes.io/affinity-mode': 'balanced' | 'persistent'
    'nginx.ingress.kubernetes.io/affinity-canary-behavior': 'sticky' | 'legacy'
    'nginx.ingress.kubernetes.io/auth-realm': string
    'nginx.ingress.kubernetes.io/auth-secret': string
    'nginx.ingress.kubernetes.io/auth-secret-type': string
    'nginx.ingress.kubernetes.io/auth-type': 'basic' | 'digest'
    'nginx.ingress.kubernetes.io/auth-tls-secret': string
    'nginx.ingress.kubernetes.io/auth-tls-verify-depth': number
    'nginx.ingress.kubernetes.io/auth-tls-verify-client': string
    'nginx.ingress.kubernetes.io/auth-tls-error-page': string
    'nginx.ingress.kubernetes.io/auth-tls-pass-certificate-to-upstream': 'true' | 'false'
    'nginx.ingress.kubernetes.io/auth-url': string
    'nginx.ingress.kubernetes.io/auth-cache-key': string
    'nginx.ingress.kubernetes.io/auth-cache-duration': string
    'nginx.ingress.kubernetes.io/auth-proxy-set-headers': string
    'nginx.ingress.kubernetes.io/auth-snippet': string
    'nginx.ingress.kubernetes.io/enable-global-auth': 'true' | 'false'
    'nginx.ingress.kubernetes.io/backend-protocol': string
    'nginx.ingress.kubernetes.io/canary': 'true' | 'false'
    'nginx.ingress.kubernetes.io/canary-by-header': string
    'nginx.ingress.kubernetes.io/canary-by-header-value': string
    'nginx.ingress.kubernetes.io/canary-by-header-pattern': string
    'nginx.ingress.kubernetes.io/canary-by-cookie': string
    'nginx.ingress.kubernetes.io/canary-weight': number
    'nginx.ingress.kubernetes.io/canary-weight-total': number
    'nginx.ingress.kubernetes.io/client-body-buffer-size': string
    'nginx.ingress.kubernetes.io/configuration-snippet': string
    'nginx.ingress.kubernetes.io/custom-http-errors': number[]
    'nginx.ingress.kubernetes.io/default-backend': string
    'nginx.ingress.kubernetes.io/enable-cors': 'true' | 'false'
    'nginx.ingress.kubernetes.io/cors-allow-origin': string
    'nginx.ingress.kubernetes.io/cors-allow-methods': string
    'nginx.ingress.kubernetes.io/cors-allow-headers': string
    'nginx.ingress.kubernetes.io/cors-expose-headers': string
    'nginx.ingress.kubernetes.io/cors-allow-credentials': 'true' | 'false'
    'nginx.ingress.kubernetes.io/cors-max-age': number
    'nginx.ingress.kubernetes.io/force-ssl-redirect': 'true' | 'false'
    'nginx.ingress.kubernetes.io/from-to-www-redirect': 'true' | 'false'
    'nginx.ingress.kubernetes.io/http2-push-preload': 'true' | 'false'
    'nginx.ingress.kubernetes.io/limit-connections': number
    'nginx.ingress.kubernetes.io/limit-rps': number
    'nginx.ingress.kubernetes.io/global-rate-limit': number
    'nginx.ingress.kubernetes.io/global-rate-limit-window': number // duration;
    'nginx.ingress.kubernetes.io/global-rate-limit-key': string
    'nginx.ingress.kubernetes.io/global-rate-limit-ignored-cidrs': string
    'nginx.ingress.kubernetes.io/permanent-redirect': string
    'nginx.ingress.kubernetes.io/permanent-redirect-code': number
    'nginx.ingress.kubernetes.io/temporal-redirect': string
    'nginx.ingress.kubernetes.io/preserve-trailing-slash': 'true' | 'false'
    'nginx.ingress.kubernetes.io/proxy-body-size': string
    'nginx.ingress.kubernetes.io/proxy-cookie-domain': string
    'nginx.ingress.kubernetes.io/proxy-cookie-path': string
    'nginx.ingress.kubernetes.io/proxy-connect-timeout': number
    'nginx.ingress.kubernetes.io/proxy-send-timeout': number
    'nginx.ingress.kubernetes.io/proxy-read-timeout': number
    'nginx.ingress.kubernetes.io/proxy-next-upstream': string
    'nginx.ingress.kubernetes.io/proxy-next-upstream-timeout': number
    'nginx.ingress.kubernetes.io/proxy-next-upstream-tries': number
    'nginx.ingress.kubernetes.io/proxy-request-buffering': string
    'nginx.ingress.kubernetes.io/proxy-redirect-from': string
    'nginx.ingress.kubernetes.io/proxy-redirect-to': string
    'nginx.ingress.kubernetes.io/proxy-http-version': '1.0' | '1.1'
    'nginx.ingress.kubernetes.io/proxy-ssl-secret': string
    'nginx.ingress.kubernetes.io/proxy-ssl-ciphers': string
    'nginx.ingress.kubernetes.io/proxy-ssl-name': string
    'nginx.ingress.kubernetes.io/proxy-ssl-protocols': string
    'nginx.ingress.kubernetes.io/proxy-ssl-verify': string
    'nginx.ingress.kubernetes.io/proxy-ssl-verify-depth': number
    'nginx.ingress.kubernetes.io/proxy-ssl-server-name': string
    'nginx.ingress.kubernetes.io/enable-rewrite-log': 'true' | 'false'
    'nginx.ingress.kubernetes.io/rewrite-target': string // URI;
    'nginx.ingress.kubernetes.io/satisfy': string
    'nginx.ingress.kubernetes.io/server-alias': string
    'nginx.ingress.kubernetes.io/server-snippet': string
    'nginx.ingress.kubernetes.io/service-upstream': 'true' | 'false'
    'nginx.ingress.kubernetes.io/session-cookie-name': string
    'nginx.ingress.kubernetes.io/session-cookie-path': string
    'nginx.ingress.kubernetes.io/session-cookie-change-on-failure': 'true' | 'false'
    'nginx.ingress.kubernetes.io/session-cookie-samesite': string
    'nginx.ingress.kubernetes.io/session-cookie-conditional-samesite-none': 'true' | 'false'
    'nginx.ingress.kubernetes.io/ssl-redirect': 'true' | 'false'
    'nginx.ingress.kubernetes.io/ssl-passthrough': 'true' | 'false'
    'nginx.ingress.kubernetes.io/stream-snippet': string
    'nginx.ingress.kubernetes.io/upstream-hash-by': string
    'nginx.ingress.kubernetes.io/x-forwarded-prefix': string
    'nginx.ingress.kubernetes.io/load-balance': string
    'nginx.ingress.kubernetes.io/upstream-vhost': string
    'nginx.ingress.kubernetes.io/whitelist-source-range': string // CIDR;
    'nginx.ingress.kubernetes.io/proxy-buffering': string
    'nginx.ingress.kubernetes.io/proxy-buffers-number': number
    'nginx.ingress.kubernetes.io/proxy-buffer-size': string
    'nginx.ingress.kubernetes.io/proxy-max-temp-file-size': string
    'nginx.ingress.kubernetes.io/ssl-ciphers': string
    'nginx.ingress.kubernetes.io/ssl-prefer-server-ciphers': 'true' | 'false'
    'nginx.ingress.kubernetes.io/connection-proxy-header': string
    'nginx.ingress.kubernetes.io/enable-access-log': 'true' | 'false'
    'nginx.ingress.kubernetes.io/enable-opentracing': 'true' | 'false'
    'nginx.ingress.kubernetes.io/opentracing-trust-incoming-span': 'true' | 'false'
    'nginx.ingress.kubernetes.io/enable-influxdb': 'true' | 'false'
    'nginx.ingress.kubernetes.io/influxdb-measurement': string
    'nginx.ingress.kubernetes.io/influxdb-port': string
    'nginx.ingress.kubernetes.io/influxdb-host': string
    'nginx.ingress.kubernetes.io/influxdb-server-name': string
    'nginx.ingress.kubernetes.io/use-regex': 'true' | 'false'
    'nginx.ingress.kubernetes.io/enable-modsecurity': boolean
    'nginx.ingress.kubernetes.io/enable-owasp-core-rules': boolean
    'nginx.ingress.kubernetes.io/modsecurity-transaction-id': string
    'nginx.ingress.kubernetes.io/modsecurity-snippet': string
    'nginx.ingress.kubernetes.io/mirror-request-body': string
    'nginx.ingress.kubernetes.io/mirror-target': string
}
