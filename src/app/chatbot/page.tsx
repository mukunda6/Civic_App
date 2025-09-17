
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { chatbotFlow } from '@/ai/flows/chatbot-flow';
import { Loader2, Bot, User, Send } from 'lucide-react';
import { Message } from 'genkit';

export default function ChatbotPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim() || !user) return;

    const userMessage: Message = { content: [{ text: prompt }], role: 'user' };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    setPrompt('');
    setLoading(true);

    try {
      const responseText = await chatbotFlow({
        userId: user.uid,
        history: newHistory,
        prompt: prompt,
      });
      const modelMessage: Message = {
        content: [{ text: responseText }],
        role: 'model',
      };
      setHistory([...newHistory, modelMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        content: [
          { text: 'Sorry, I encountered an error. Please try again.' },
        ],
        role: 'model',
      };
      setHistory([...newHistory, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Bot className="h-6 w-6 text-primary" />
            GHMC Chatbot Assistant
          </CardTitle>
          <CardDescription>
            Your 24/7 digital helper for civic issues. Ask me about the status
            of your reports.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 && (
             <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Start the conversation!</p>
            </div>
          )}
          {history.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div className="bg-primary text-primary-foreground rounded-full p-2">
                  <Bot className="h-5 w-5" />
                </div>
              )}
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {msg.content[0].text}
              </div>
               {msg.role === 'user' && (
                <div className="bg-muted rounded-full p-2">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
          {loading && (
             <div className="flex items-start gap-3 justify-start">
                <div className="bg-primary text-primary-foreground rounded-full p-2">
                  <Bot className="h-5 w-5" />
                </div>
                 <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                 </div>
             </div>
          )}
        </CardContent>
        <div className="p-4 border-t">
          <div className="relative">
            <Input
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your complaints..."
              className="pr-12"
              disabled={loading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={handleSend}
              disabled={loading || !prompt.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
