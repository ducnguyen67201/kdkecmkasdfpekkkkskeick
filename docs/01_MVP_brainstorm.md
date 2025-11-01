MVP OctoLab
1. cve might stick with multiple product / use cve from national vulnerability db
2. pull CVE (AI)
3. AI parse intent , they wanted to test this CVE for product (version x.x)
4. high CVE (auto approve? anual approve)
Architecture (3 layer)
----------
OS bases (may be close enough, OS has bene archived)
+ neeed software - few registries,
+ ex: jquery need brower
----------
Software
+ what configure we need
+ How they're turn off (Docker, VM) ??
Use case
- If they have a chance to escape docker => throw to VM
- browser / terminal UI (VPM profile? wireguard, openVPN)
- user only allow to spawn only one machine
----------
After test:
- User get a json file / comment file (output result)  - export log + trademark
- zip them send back customer
Tester has found a certain CVE - they wanted to test specific CVE , we wanted to test those locally before we can run it on customer environment . more like provide a reliable report
- we will provided infras / environment for them to test
- for them to assess risk ?
PENTESET: web server / file upload (CVE-2023-36212)
+ total CMS
-----------
|DOCKER    |
|browser   |
|totalCMS  |
..... (N) apps
-----------
-----------
|DOCKER    |
|postgres  |
|          |
-----------
Apache Guacamole to connect to docker / VM
## UI/UX Flow Sketches
### Login
```
+---------------------------------------+
|  OctoLab                              |
|  [ Logo ]                             |
|  -----------------------------------  |
|  Email / SSO [ ] Remember me          |
|  Password                             |
|  [ Sign In ]   [ Forgot? ]            |
|  -----------------------------------  |
|  Need access? -> request onboarding   |
+---------------------------------------+
```
- Status strip below header (system health) and optional MFA prompt overlay.
### Request Lab Chat
```
+------------------------------------------+  +------------------+
| New Lab                                  |  | Guardrails       |
| Bot: "What do you need?"                 |  | - 1 active lab   |
| You: "TotalCMS CVE-2023-36212 test"      |  | - Severity gate  |
| LLM summary + blueprint card             |  | - TTL default 4h |
|                                          |  |                  |
| [Edit Inputs]    [Confirm Request]       |  +------------------+
+------------------------------------------+
```
- Quick-pick pills for recent CVEs, manual form fallback, and intent summary with risk badge.
### Package Preview and Countdown
```
+---------------------------------------------------+
| Target Summary                                    |
|  Blueprint: totalcms-web-1.7.4 (container)         |
|  Dependencies: Postgres 14, php:8.1-apache         |
|  PoC bundle: upload exploit                        |
|                                                   |
| Config Details                                     |
|  - Admin user: pentester@octolab                  |
|  - DB creds: totalcms / ********                  |
|                                                   |
| Estimated Run Time: 2h      Cost: 1 credit         |
| [Back]                                [Provision] |
+---------------------------------------------------+
```
- On confirm, show a "clock run" progress tracker with step-by-step status and live logs.
### Provision Status
```
+-----------------------------------------------------+
| Provisioning Lab #4821                              |
| 1/5 Resolve blueprint          [done]               |
| 2/5 Build container bundle     80% (running)        |
| 3/5 Smoke tests                queued               |
|                                                     |
| Live Logs                                           |
| 14:32 docker build started                          |
| 14:34 image pulled from registry                    |
|                                                     |
| [Cancel Request]                                    |
+-----------------------------------------------------+
```
- ETA pill in header, toast when ready, retry guidance if a step fails.
### Live Access Dashboard
```
+-------------------------------+---------------------+
| Connections                   | Guacamole Preview   |
| - Target: TotalCMS            | [Launch Terminal]   |
| - Kali Desktop                |---------------------|
|                               | Embedded iframe     |
| Credentials                   | with Guac session   |
|  SSH: copy (30s)              |                     |
|  VPN: download                |                     |
+-------------------------------+---------------------+
```
- Tabs for browser terminal vs full desktop; activity feed (session join, commands) on the side.
### Session Wrap-Up
```
+------------------------------------------------------+ 
| Session Summary                                      |
|  Uptime: 01:47:13                                    |
|  Evidence artifacts: 4                               |
|                                                      |
| Notes (optional) [textarea]                          |
|                                                      |
| [Request Extension]     [End and Collect Evidence]   |
+------------------------------------------------------+ 
```
- Post-end modal shows teardown progress and evidence packaging status.
### Evidence Delivery
```
+-----------------------------------------------+
| Export Package Ready                          |
|  - report.json (signed)                       |
|  - evidence.zip (hash: ...)                   |
|  - signature.pem                              |
|                                               |
| [Copy Download Link]   [Email to Customer]    |
| Integrity: [OK] PKI signature verified        |
+-----------------------------------------------+
```
- Include checksum, expiry timer, and shortcut to "Re-run lab" with same blueprint.