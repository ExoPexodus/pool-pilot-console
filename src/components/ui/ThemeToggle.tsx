
import { Button } from "@/components/ui/button";
import { Sun } from "lucide-react";

const ThemeToggle = () => {
  // For now this is just a visual placeholder
  return (
    <Button variant="ghost" size="icon">
      <Sun className="h-5 w-5" />
    </Button>
  );
};

export default ThemeToggle;
