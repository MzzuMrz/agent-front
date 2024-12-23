import React, { useState } from "react";

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [recommendationPrompt, setRecommendationPrompt] = useState<string>("");
  const [recommendationResponse, setRecommendationResponse] = useState<string>("");

  // Función para enviar el JSON al backend
  const handleSend = async () => {
    if (!prompt.trim()) {
      setResponse("El campo de instrucción está vacío. Por favor, escribe algo.");
      return;
    }

    let jsonData;
    try {
      // Intentar convertir el prompt en JSON
      jsonData = JSON.parse(prompt);
    } catch (error) {
      setResponse("❌ Error: El contenido ingresado no es un JSON válido.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/deploy-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      if (!res.ok) {
        throw new Error("Error en el servidor");
      }

      const data: {
        success: boolean;
        mintAddress?: string;
        message: string;
      } = await res.json();

      if (data.success) {
        setResponse(
          `✅ Token desplegado con éxito:\n- Mint Address: ${
            data.mintAddress || "N/A"
          }\n- Mensaje: ${data.message}`
        );
      } else {
        setResponse(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setResponse("⚠️ Hubo un error al comunicarse con el backend. Verifica tu conexión.");
    }
  };

  // Función para enviar un prompt al backend y recibir recomendaciones
  const handleRecommend = async () => {
    if (!recommendationPrompt.trim()) {
      setRecommendationResponse("El campo de recomendación está vacío. Por favor, escribe algo.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: recommendationPrompt }),
      });

      if (!res.ok) {
        throw new Error("Error en el servidor");
      }

      const data: {
        success: boolean;
        suggestions?: string;
      } = await res.json();

      if (data.success) {
        setRecommendationResponse(`✅ Recomendaciones:\n${data.suggestions || "N/A"}`);
      } else {
        setRecommendationResponse("❌ No se pudieron generar recomendaciones.");
      }
    } catch (error) {
      console.error(error);
      setRecommendationResponse("⚠️ Hubo un error al comunicarse con el backend. Verifica tu conexión.");
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333" }}>Mini dApp con IA y Solana</h1>

      {/* Sección para desplegar un token */}
      <h3>Desplegar Token en Solana test</h3>
      <textarea
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={`Escribe tu JSON aquí:\n{
  "name": "MyToken",
  "uri": "https://example.com/metadata.json",
  "symbol": "MTK",
  "decimals": 9,
  "initialSupply": 1000000
}`}
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "1rem",
        }}
      />
      <button
        onClick={handleSend}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: "pointer",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "4px",
          width: "100%",
        }}
      >
        Enviar
      </button>
      <pre
        style={{
          marginTop: "1rem",
          padding: "1rem",
          backgroundColor: "#000",
          borderRadius: "4px",
          whiteSpace: "pre-wrap",
          fontSize: "0.9rem",
        }}
      >
        {response || "La respuesta aparecerá aquí..."}
      </pre>

      {/* Sección para recomendaciones con IA */}
      <h3>Solicitar Recomendaciones</h3>
      <textarea
        rows={4}
        value={recommendationPrompt}
        onChange={(e) => setRecommendationPrompt(e.target.value)}
        placeholder="Escribe tu pregunta (Ejemplo: ¿Cómo puedo crear un token en Solana?)"
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "1rem",
        }}
      />
      <button
        onClick={handleRecommend}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: "pointer",
          backgroundColor: "#28A745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          width: "100%",
        }}
      >
        Obtener Recomendaciones
      </button>
      <pre
        style={{
          marginTop: "1rem",
          padding: "1rem",
          backgroundColor: "#000",
          borderRadius: "4px",
          whiteSpace: "pre-wrap",
          fontSize: "0.9rem",
        }}
      >
        {recommendationResponse || "Las recomendaciones aparecerán aquí..."}
      </pre>
    </div>
  );
};

export default App;
