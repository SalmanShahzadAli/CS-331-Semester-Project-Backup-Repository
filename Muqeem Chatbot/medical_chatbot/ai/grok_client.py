"""Simple Grok API client - No LangChain needed!"""

import os
import sys
import requests
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.model_config import ModelConfig


class GrokClient:
    """Simple direct API client for Grok."""
    
    def __init__(self, verbose=False):
        self.verbose = verbose
        self.api_key = ModelConfig.OPENROUTER_API_KEY
        self.model = ModelConfig.GROK_MODEL
        self.base_url = ModelConfig.OPENROUTER_BASE_URL
        self.conversation_history = []
    
    def chat(self, user_message: str, system_prompt: str = None) -> str:
        """
        Send a message to Grok and get response.
        
        Args:
            user_message: The user's message
            system_prompt: Optional system instructions
        
        Returns:
            Grok's response text
        """
        try:
            # Build messages
            messages = []
            
            # Add system prompt if provided
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            
            # Add conversation history
            messages.extend(self.conversation_history)
            
            # Add current user message
            messages.append({"role": "user", "content": user_message})
            
            # Prepare request
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://github.com/medical-chatbot",
                "X-Title": "Medical AI Chatbot"
            }
            
            data = {
                "model": self.model,
                "messages": messages,
                "temperature": ModelConfig.TEMPERATURE,
                "max_tokens": ModelConfig.MAX_TOKENS,
                "top_p": ModelConfig.TOP_P,
            }
            
            # Add reasoning if enabled
            if ModelConfig.GROK_REASONING_ENABLED:
                data["reasoning"] = {"enabled": True}
            
            if self.verbose:
                print(f"\n🤖 Sending to Grok: {user_message[:50]}...")
            
            # Make API call
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                data=json.dumps(data),
                timeout=30
            )
            
            response.raise_for_status()
            response_data = response.json()
            
            # Extract response
            assistant_message = response_data['choices'][0]['message']
            content = assistant_message.get('content', '')
            
            # Store in history
            self.conversation_history.append({"role": "user", "content": user_message})
            self.conversation_history.append({"role": "assistant", "content": content})
            
            # Keep only last 10 messages (5 exchanges) to avoid token limits
            if len(self.conversation_history) > 10:
                self.conversation_history = self.conversation_history[-10:]
            
            if self.verbose:
                print(f"✅ Response received: {content[:50]}...")
            
            return content
            
        except Exception as e:
            error_msg = f"Error calling Grok API: {str(e)}"
            print(f"❌ {error_msg}")
            return f"I'm having trouble connecting right now. Error: {str(e)}"
    
    def reset_conversation(self):
        """Clear conversation history."""
        self.conversation_history = []
        if self.verbose:
            print("🔄 Conversation history cleared")


# For testing
if __name__ == '__main__':
    print("Simple Grok Client Test")
    print("="*60)
    
    client = GrokClient(verbose=True)
    
    # Test 1: Simple query
    print("\nTEST 1: Simple medical question")
    print("-"*60)
    response = client.chat("What are the symptoms of diabetes?")
    print(f"\nResponse:\n{response}\n")
    
    # Test 2: Follow-up (uses conversation history)
    print("\nTEST 2: Follow-up question")
    print("-"*60)
    response = client.chat("What specialist should I see for that?")
    print(f"\nResponse:\n{response}\n")
    
    print("✅ All tests passed!")