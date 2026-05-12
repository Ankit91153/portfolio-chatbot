import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DefaultQuestion {
  question: string;
  answer: string;
}

interface DefaultQuestionsSectionProps {
  data: DefaultQuestion[];
  onChange: (data: DefaultQuestion[]) => void;
}

export function DefaultQuestionsSection({ data = [], onChange }: DefaultQuestionsSectionProps) {
  const addQuestion = () => {
    if (data.length >= 5) return;
    onChange([...data, { question: "", answer: "" }]);
  };

  const removeQuestion = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof DefaultQuestion, value: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Default Chat Questions</h3>
          <p className="text-sm text-muted-foreground">Add up to 5 quick questions that visitors can click to ask your bot.</p>
        </div>
        <Button onClick={addQuestion} variant="outline" size="sm" disabled={data.length >= 5}>
          <Plus className="h-4 w-4 mr-2" />
          Add Question ({data.length}/5)
        </Button>
      </div>

      <div className="space-y-4">
        {data.map((q, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-4 relative group">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeQuestion(index)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
            
            <div className="space-y-2 pr-8">
              <Label>Question</Label>
              <Input
                placeholder="e.g., What is your tech stack?"
                value={q.question}
                onChange={(e) => updateQuestion(index, "question", e.target.value)}
              />
            </div>
            
            <div className="space-y-2 pr-8">
              <Label>Answer</Label>
              <Textarea
                placeholder="e.g., I specialize in React, Node.js, and MongoDB."
                value={q.answer}
                onChange={(e) => updateQuestion(index, "answer", e.target.value)}
              />
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
            No default questions added. Click the button above to add one.
          </div>
        )}
      </div>
    </div>
  );
}
