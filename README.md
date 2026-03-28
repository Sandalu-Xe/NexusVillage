# 🏙️ NexusVillage Metropolis: A 3D Driving & AI Experience

Welcome to **NexusVillage Metropolis**, an immersive, procedurally generated 3D world where futuristic architecture meets advanced driving physics and real-time AI interaction.

Explore a vast urban landscape, take the wheel of a high-performance vehicle, and engage in meaningful conversations with the city's residents—all powered by cutting-edge web technologies.

---

## 🚀 Key Features

*   **🏎️ Advanced Driving Physics:** Experience realistic acceleration, braking, and tire friction. Drift through corners and navigate a complex road network.
*   **🤖 AI-Powered NPCs:** Interact with the city's residents using the **Google Gemini API**. Engage in real-time, context-aware conversations with unique characters.
*   **🌍 Procedural 3D World:** A massive, ever-expanding metropolis with 25 active building clusters, dynamic traffic, and detailed environments.
*   **☁️ Atmospheric Immersion:** Relax under a serene, animated sky with slow-moving clouds and twinkling stars.
*   **🗺️ Multi-View Navigation:** Switch seamlessly between **Explorer Mode**, **Map View**, and **Drive Mode** to experience the city from every angle.
*   **📱 Responsive & Performant:** Built with a modern stack optimized for smooth 60FPS performance in the browser.

---

## 🛠️ Technology Stack

This project leverages the latest in web development to create a high-fidelity 3D experience:

### **Core Frameworks**
*   **[React 19](https://react.dev/):** The foundation for our component-based UI and state management.
*   **[TypeScript](https://www.typescriptlang.org/):** Ensuring type safety and robust code across the entire project.

### **3D & Graphics**
*   **[Three.js](https://threejs.org/):** The powerhouse behind the 3D rendering engine.
*   **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber):** A powerful React reconciler for Three.js.
*   **[@react-three/drei](https://github.com/pmndrs/drei):** A collection of useful helpers and abstractions for R3F.

### **Artificial Intelligence**
*   **[Google Gemini API](https://ai.google.dev/):** Powering the intelligent NPC dialogue system with the `gemini-1.5-flash` model.

### **Styling & UI**
*   **[Tailwind CSS 4](https://tailwindcss.com/):** For rapid, utility-first styling and a sleek, modern interface.
*   **[Framer Motion](https://www.framer.com/motion/):** Driving smooth UI transitions and interactive animations.
*   **[Lucide React](https://lucide.dev/):** A beautiful and consistent icon set.

### **Build & Deployment**
*   **[Vite 6](https://vitejs.dev/):** The next-generation frontend tool for lightning-fast development and builds.
*   **[Vercel](https://vercel.com/):** Optimized hosting with custom client-side routing configuration.

---

## 🎮 Controls

| Action | Control |
| :--- | :--- |
| **Drive Forward / Accelerate** | `W` or `↑` |
| **Brake / Reverse** | `S` or `↓` |
| **Steer Left** | `A` or `←` |
| **Steer Right** | `D` or `→` |
| **Handbrake** | `Spacebar` |
| **Interact with NPC** | `Left Click` on Character |
| **Rotate Camera** | `Left Click + Drag` (Explorer Mode) |
| **Pan Camera** | `Right Click + Drag` (Explorer Mode) |
| **Zoom In/Out** | `Scroll Wheel` |

---

## ⚙️ Getting Started

To run this project locally or deploy it yourself, you will need:

1.  **Google Gemini API Key:** Obtain your key from [Google AI Studio](https://aistudio.google.com/).
2.  **Environment Variables:** Create a `.env` file and add your key:
    ```env
    GEMINI_API_KEY="your_api_key_here"
    ```
3.  **Install Dependencies:**
    ```bash
    npm install
    ```
4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

---
---
<img width="1680" height="952" alt="image" src="https://github.com/user-attachments/assets/9c5ea595-41ed-4293-b194-e356eaf1225a" />

---



Developed with ❤️ for the future of the web.
