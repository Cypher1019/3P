import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  onDownload?: () => void;
  className?: string;
}

const ChartCard = ({ title, description, children, onDownload, className }: ChartCardProps) => {
  return (
    <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold text-foreground">{title}</CardTitle>
          {description && (
            <CardDescription className="text-muted-foreground">{description}</CardDescription>
          )}
        </div>
        {onDownload && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="shrink-0"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
};

export default ChartCard;