
import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";

const ThemeToggle = () => {
  // For now this is just a visual placeholder
  return (
    <Button variant="ghost" size="icon">
      <Moon className="h-5 w-5" />
    </Button>
  );
};

export default ThemeToggle;
