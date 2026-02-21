# OpenClaw + Office Buddies via Tailscale (Guia Completo)

Guia atualizado para conectar o Office Buddies ao OpenClaw **sem expor dados pessoais** e com opção de acesso seguro via HTTPS/WSS.

---

## 1) Pré-requisitos

- OpenClaw instalado no servidor
- Office Buddies no cliente (Windows/macOS/Linux)
- Servidor e cliente na mesma Tailnet
- Porta do gateway: `18789`

---

## 2) Escolha do modo de acesso

Você pode operar de 2 formas:

### Modo A — Direto por Tailnet (simples, HTTP)
- Endpoint no app: `http://<TAILSCALE_IP_DO_SERVIDOR>:18789`
- Mais simples para começar
- Tráfego dentro da Tailnet

### Modo B — Seguro por Tailscale Serve (recomendado)
- Endpoint no app: `https://<SEU_HOST_TAILNET>.ts.net`
- WebSocket seguro: `wss://<SEU_HOST_TAILNET>.ts.net`
- Evita erros de segurança com `ws://` em IP não-loopback

> Recomendação: use o **Modo B** sempre que possível.

---

## 3) Configuração base no servidor

```bash
openclaw config set gateway.port 18789
openclaw config set gateway.http.endpoints.chatCompletions.enabled true
openclaw config set gateway.auth.mode token
```

### Gerar/definir token

```bash
NEW_TOKEN=$(openssl rand -hex 32)
openclaw config set gateway.auth.token "$NEW_TOKEN"
echo "$NEW_TOKEN"
```

> Guarde o token. Ele será usado como **API Key** no Office Buddies.

---

## 4) Subir gateway (conforme o modo)

### 4.1 Modo A (Tailnet direto)

```bash
openclaw gateway run --bind tailnet --force
```

### 4.2 Modo B (HTTPS/WSS com Tailscale Serve)

```bash
openclaw gateway run --bind loopback --tailscale serve --force
```

Se aparecer erro de permissão do tailscale serve, execute uma vez:

```bash
sudo tailscale set --operator=$USER
```

Depois rode novamente o comando do Modo B.

---

## 5) Descobrir o endpoint

### Para Modo A
No servidor:

```bash
tailscale ip -4
```

Use no app:

`http://<TAILSCALE_IP_DO_SERVIDOR>:18789`

### Para Modo B
Pegue o host `.ts.net` exibido no log/status e use:

- HTTP API: `https://<SEU_HOST_TAILNET>.ts.net`
- WebSocket seguro: `wss://<SEU_HOST_TAILNET>.ts.net`

---

## 6) Teste rápido de API (cliente)

Substitua placeholders antes de rodar:

```bash
curl -sS <BASE_URL>/v1/chat/completions \
  -H "Authorization: Bearer <SEU_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"model":"openai-codex/gpt-5.3-codex","messages":[{"role":"user","content":"oi"}]}'
```

Onde `<BASE_URL>` é:
- Modo A: `http://<TAILSCALE_IP_DO_SERVIDOR>:18789`
- Modo B: `https://<SEU_HOST_TAILNET>.ts.net`

Se retornar JSON com `choices`, a API está OK.

---

## 7) Configurar Office Buddies

No painel **Model**:

- **Provider**: `openclaw`
- **Endpoint URL**:
  - Modo A: `http://<TAILSCALE_IP_DO_SERVIDOR>:18789`
  - Modo B: `https://<SEU_HOST_TAILNET>.ts.net`
- **API Key**: `<SEU_TOKEN>`
- **Model**: `openai-codex/gpt-5.3-codex`

Depois:
1. Clique em **Refresh Models**
2. Reinicie o app
3. Teste com uma mensagem simples

---

## 8) Troubleshooting rápido

### `fetch failed`
- Endpoint incorreto
- Gateway fora do ar
- Bind incompatível com o modo escolhido

### `Unauthorized`
- Token inválido ou ausente
- API Key diferente do token no servidor

### `SECURITY ERROR: ws://... non-loopback`
- Use Modo B (`--tailscale serve`) com `wss://...`
- Ou mantenha CLI/local em loopback

### `No available auth profile for google-antigravity`
- Problema de credencial do provider
- Trocar temporariamente para `openai-codex/gpt-5.3-codex`

---

## 9) Hardening recomendado

Após testes, mantenha essas flags seguras:

```bash
openclaw config set gateway.controlUi.allowInsecureAuth false
openclaw config set gateway.controlUi.dangerouslyDisableDeviceAuth false
```

Se token foi exposto:

```bash
NEW_TOKEN=$(openssl rand -hex 32)
openclaw config set gateway.auth.token "$NEW_TOKEN"
echo "$NEW_TOKEN"
```

Atualize o novo token no Office Buddies.

---

## 10) Checklist final

- [ ] Endpoint correto para o modo escolhido
- [ ] `curl` retornando resposta válida
- [ ] Office Buddies com Provider `openclaw`
- [ ] API Key igual ao token atual
- [ ] Mensagens respondendo no chat
- [ ] Flags inseguras desativadas
