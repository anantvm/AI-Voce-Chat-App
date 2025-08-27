# 🎙️ AI Voice Chat Application

This project is a **full-stack voice chat application** that allows users to have a real-time voice conversation with an AI.  
It leverages a **modern React frontend** and a **Node.js backend** to perform **real-time transcription** and **AI-powered text generation**.

---

## ✨ Features

- 🎤 **Real-time Voice Transcription** – Records your speech and converts it into text.  
- 🤖 **AI-Powered Responses** – Sends the transcribed text to the Gemini API to generate thoughtful replies.  
- 🖼️ **Clean UI** – A simple and responsive user interface built with **React** + **Tailwind CSS**.  
- ⚙️ **Scalable Architecture** – Decoupled frontend & backend for flexibility and easy maintenance.  

---

## 🛠️ Technologies Used

### **Frontend (voice-chat-app)**
- React – JavaScript library for building UIs  
- Vite – Fast build tool for modern web apps  
- Tailwind CSS – Utility-first CSS framework  

### **Backend (meeting-sum-backend)**
- Node.js – JavaScript runtime for backend  
- Express.js – Minimalist web framework  
- Google Cloud Speech-to-Text API – Speech transcription  
- Google Gemini API – AI text generation  

---

## 🚀 Getting Started

### **Prerequisites**
- Install Node.js & npm  
- Obtain API keys:
  - Google Cloud Speech-to-Text API Key  
  - Google Gemini API Key  

---

### **Setup**

#### 1️⃣ Clone the repository
git clone <your-repository-url>  
cd <your-repository-name>  

#### 2️⃣ Backend Setup
cd meeting-sum-backend  

Create a `.env` file and add your keys:  


Install dependencies:  
npm install  

Start the server:  
node server.js  

#### 3️⃣ Frontend Setup
Open a new terminal and run:  
cd voice-chat-app  
npm install  
npm run dev  

---

## 🎯 Usage
1. Run **both backend & frontend servers**.  
2. Open the frontend in your browser → usually: http://localhost:5173  
3. Click **"Start Conversation"**.  
4. Allow microphone access.  
5. Speak for a few seconds → The app transcribes your speech & shows AI-generated responses.  

---

## 🤝 Contributing
Pull requests are welcome!  
For major changes, please open an issue first to discuss what you’d like to update.  

---

## 📜 License
This project is licensed under the **MIT License**.  

---

💡 Built with ❤️ using **React, Node.js & Gemini API**
