import { useState } from 'react';

const Chat = ({ spots }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'ask away!\n e.g. "where can i get a nice drink?", "find some quiet places", or "what is the best cafe with [ amenity ] in [ suburb ]?"' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');

    setTimeout(() => {
      const response = generateBotResponse(userMessage, spots);
      setMessages((prev) => [...prev, { sender: 'bot', text: response }]);
    }, 400);
  };

  const generateBotResponse = (query, data) => {
    if (!data || data.length === 0) {
      return "I'm still loading the data maps. Please give me a quick second and try again!";
    }

    const lowerQuery = query.toLowerCase();

    // 1. basic filters & amenities
    let filteredData = data;
    let amenityNotes = [];

    if (lowerQuery.includes('wifi') || lowerQuery.includes('wi-fi')) {
      filteredData = filteredData.filter(f => String(f.properties['has-wifi']).toUpperCase() === 'TRUE');
      amenityNotes.push('Wi-Fi');
    }
    if (lowerQuery.includes('outlet') || lowerQuery.includes('power') || lowerQuery.includes('charging')) {
      filteredData = filteredData.filter(f => String(f.properties['has-outlets']).toUpperCase() === 'TRUE');
      amenityNotes.push('outlets');
    }

    // 2. scan for suburb mentioned
    let matchedSuburb = null;
    for (const spot of data) {
      const suburb = spot.properties.suburb?.toLowerCase();
      if (suburb && lowerQuery.includes(suburb)) {
        matchedSuburb = spot.properties.suburb;
        break;
      }
    }
    if (matchedSuburb) {
      filteredData = filteredData.filter(f => f.properties.suburb?.toLowerCase() === matchedSuburb.toLowerCase());
    }

    // 3. scan reviews 
    const reviewMatches = [];

    filteredData.forEach(spot => {
      const properties = spot.properties;
      const reviewsList = properties.reviews || [];
      let totalSpotScore = 0;
      let primaryMatchingSnippet = "";

      reviewsList.forEach(review => {
        const reviewText = review.text || "";
        const lowerReviewText = reviewText.toLowerCase();

        const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 3);
        let matchCount = 0;

        queryWords.forEach(word => {
          if (lowerReviewText.includes(word)) {
            matchCount++;
          }
        });

        if (matchCount > 0) {
          totalSpotScore += matchCount;
          
          if (!primaryMatchingSnippet) {
            const sentences = reviewText.split(/[.!?]\n*/);
            const matchingSentence = sentences.find(s => 
              queryWords.some(word => s.toLowerCase().includes(word))
            );
            primaryMatchingSnippet = matchingSentence ? matchingSentence.trim() : reviewText.substring(0, 100);
          }
        }
      });

      if (totalSpotScore > 0) {
        reviewMatches.push({
          spot,
          score: totalSpotScore,
          snippet: primaryMatchingSnippet
        });
      }
    });

    reviewMatches.sort((a, b) => b.score - a.score);

    // 4. build output msg based on search checks
    if (reviewMatches.length > 0) {
      const topMatches = reviewMatches.slice(0, 3);
      let reply = `based on what people are saying in the reviews, here are some options:\n`;
      
      topMatches.forEach(item => {
        const p = item.spot.properties;
        reply += `\n✧ ${p.name} (${p.suburb})\n`;
        reply += `✩ Rating: ${p.rating} / 5\n`;
        reply += `🗨️ "${item.snippet}..."\n`;
      });
      return reply;
    }

    // --- ADDED FALLBACK FOR SUBURB ONLY MATCHES ---
    // if a suburb was requested but no review text matched, just show everything in that suburb!
    if (matchedSuburb && filteredData.length > 0) {
      let reply = `I found ${filteredData.length} study spots in ${matchedSuburb}:\n`;
      filteredData.slice(0, 3).forEach(spot => {
        const p = spot.properties;
        reply += `\n✧ ${p.name}\n✩ Rating: ${p.rating || 'N/A'} / 5\n`;
      });
      return reply;
    }

    // 5. fallback standard checks if no exact review textual matches exist
    if (lowerQuery.includes('best') || lowerQuery.includes('highest rated')) {
      const topRated = [...filteredData]
        .filter(f => f.properties.rating)
        .sort((a, b) => Number(b.properties.rating) - Number(a.properties.rating));

      if (topRated.length > 0) {
        const p = topRated[0].properties;
        return `the highest rated option available is "${p.name}" in ${p.suburb || 'Sydney'} with ✩ ${p.rating} stars.`;
      }
    }

    const nameMatch = filteredData.find(f => f.properties.name?.toLowerCase().includes(lowerQuery));
    if (nameMatch) {
      const p = nameMatch.properties;
      return `i found "${p.name}" in ${p.suburb}. It has a user score of ✩ ${p.rating} with ${p.rating_count} total logged submissions.`;
    }

    return "i couldn't find matches containing those keywords inside our user feedback, try searching with different wording!";
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3><i>STUDY BOT ASSISTANT</i></h3>
      </div>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble-wrapper ${msg.sender}`}>
            <div className={`chat-bubble ${msg.sender}`}>
              {msg.text.split('\n').map((line, idx) => (
                <p key={idx} style={{ margin: '4px 0' }}>{line}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type your question here ..."
          className="chat-input-field"
        />
        <button type="submit" className="chat-send-btn">ᯓ➤</button>
      </form>
    </div>
  );
};

export default Chat;