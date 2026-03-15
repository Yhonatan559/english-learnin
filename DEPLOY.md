# Desplegar English Learning a producción (gratis) — Paso a paso

Sigue estos pasos en orden. Al final tendrás la app en internet sin coste.

---

## Paso 0: Instalar Git (si no lo tienes)

1. Descarga Git para Windows: https://git-scm.com/download/win  
2. Instala con las opciones por defecto.  
3. Cierra y vuelve a abrir la terminal (PowerShell o CMD) para que reconozca `git`.

---

## Paso 1: Subir el proyecto a GitHub

### 1.1 Abrir terminal en la carpeta del proyecto

En PowerShell o CMD:

```powershell
cd "c:\Users\User\Videos\software de ingles"
```

### 1.2 Inicializar Git y primer commit

```powershell
git init
git add .
git commit -m "Initial commit - English Learning app"
```

### 1.3 Crear el repositorio en GitHub

1. Entra en **https://github.com/new**  
2. **Repository name:** `english-learning` (o el nombre que quieras)  
3. Elige **Public**  
4. No marques “Add a README”  
5. Clic en **Create repository**

### 1.4 Conectar y subir

En la terminal (sustituye `TU_USUARIO` por tu usuario de GitHub):

```powershell
git remote add origin https://github.com/TU_USUARIO/english-learning.git
git branch -M main
git push -u origin main
```

Te pedirá usuario y contraseña de GitHub. Si pide “token”, en GitHub: Settings → Developer settings → Personal access tokens → crea uno y úsalo como contraseña.

---

## Paso 2: Desplegar el backend en Render

1. Entra en **https://render.com** e inicia sesión con **GitHub**.  
2. Clic en **New +** → **Web Service**.  
3. Conecta tu cuenta de GitHub si te lo pide y elige el repo **english-learning**.  
4. Rellena:
   - **Name:** `english-learning-api`
   - **Region:** el más cercano (ej. Frankfurt)
   - **Root Directory:** escribe `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. En **Environment** (Environment Variables), añade:
   - **Key:** `NODE_ENV` → **Value:** `production`
   - **Key:** `JWT_SECRET` → **Value:** una clave larga (ej. `miClaveSecreta123MuyLargaParaProduccion`)
6. Clic en **Create Web Service**.  
7. Espera a que el primer deploy termine (unos 2–3 minutos).  
8. Arriba verás la URL del servicio, por ejemplo:  
   `https://english-learning-api.onrender.com`  
9. Prueba en el navegador:  
   `https://english-learning-api.onrender.com/api/health`  
   Debe salir: `{"ok":true}`  

**Copia esa URL** (sin `/api/health`, solo hasta `.com`). La necesitas en el siguiente paso.

---

## Paso 3: Desplegar el frontend en Vercel

1. Entra en **https://vercel.com** e inicia sesión con **GitHub**.  
2. Clic en **Add New…** → **Project**.  
3. Importa el repo **english-learning**.  
4. Configura:
   - **Root Directory:** clic en **Edit**, elige `frontend` y **Continue**
   - **Framework Preset:** Vite (debería detectarlo solo)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. En **Environment Variables**:
   - **Name:** `VITE_API_URL`  
   - **Value:** la URL de Render del paso 2 **+** `/api`  
     Ejemplo: `https://english-learning-api.onrender.com/api`  
6. Clic en **Deploy**.  
7. Cuando termine, te dará una URL tipo:  
   `https://english-learning-xxxx.vercel.app`

---

## Paso 4: Probar en producción

1. Abre la URL de Vercel (la del frontend).  
2. Regístrate con un correo y contraseña.  
3. Entra y prueba lecciones, vocabulario o conversación.  

Si algo falla, revisa:

- Que **VITE_API_URL** en Vercel sea exactamente: `https://TU-BACKEND.onrender.com/api`  
- Que en Render el servicio esté en estado **Live** (verde).  
- La primera vez que entres puede tardar ~30 segundos (Render “despierta” el backend en plan gratis).

---

## Resumen de URLs

| Qué      | Dónde      | URL ejemplo |
|----------|------------|-------------|
| App (usuarios) | Vercel  | https://english-learning-xxxx.vercel.app |
| API (backend)  | Render  | https://english-learning-api.onrender.com |

---

## Notas

- **Render (gratis):** el backend se duerme sin tráfico; la primera petición puede tardar ~30–50 s.  
- **Datos:** se guardan en un archivo JSON en el servidor. Si redepliegas o Reinicias el servicio en Render, los datos pueden perderse. Para algo permanente después puedes usar una base de datos gratis (Neon, MongoDB Atlas, etc.).  
- Ya tienes un **.gitignore** para no subir `node_modules`, `.env` ni `frontend/dist`.

Si en algún paso te sale un error, copia el mensaje y el paso número y lo revisamos.
