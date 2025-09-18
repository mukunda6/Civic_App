
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, Loader2, Send, User, X } from 'lucide-react';
import { Separator } from './ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { chatbotFlow } from '@/ai/flows/chatbot-flow';
import type { Message } from 'genkit';

export function ChatbotWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
          aria-label="Open chatbot"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-96 mr-4 mb-2 p-0 border-0"
        side="top"
        align="end"
      >
        <Card className="flex-1 flex flex-col shadow-2xl h-[60vh] max-h-[600px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-headline">
                <Bot className="h-6 w-6 text-primary" />
                CivicBot Assistant
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              I'm here to help with your GHMC questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {history.length === 0 && (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                    <p className="text-muted-foreground text-sm">Hello 👋 I’m your GHMC Assistant. How can I help you today?</p>
                </div>
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
                  className={`max-w-xs rounded-lg p-3 text-sm ${
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
                placeholder="Ask me anything..."
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
      </PopoverContent>
    </Popover>
  );
}
