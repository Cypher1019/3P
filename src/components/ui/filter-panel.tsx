import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterPanelProps {
  filters: {
    season?: string;
    team?: string;
    position?: string;
    player?: string;
  };
  onFilterChange: (key: string, value: string | undefined) => void;
  filterOptions: {
    seasons?: FilterOption[];
    teams?: FilterOption[];
    positions?: FilterOption[];
    players?: FilterOption[];
  };
  className?: string;
}

const FilterPanel = ({ filters, onFilterChange, filterOptions, className }: FilterPanelProps) => {
  const activeFilters = Object.entries(filters).filter(([_, value]) => value);

  const clearFilter = (key: string) => {
    onFilterChange(key, undefined);
  };

  const clearAllFilters = () => {
    Object.keys(filters).forEach(key => {
      onFilterChange(key, undefined);
    });
  };

  return (
    <Card className={`bg-muted/30 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Filters</CardTitle>
          {activeFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filterOptions.seasons && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Season</label>
              <Select value={filters.season || ""} onValueChange={(value) => onFilterChange("season", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Seasons" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.seasons.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {filterOptions.teams && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Team</label>
              <Select value={filters.team || ""} onValueChange={(value) => onFilterChange("team", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.teams.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {filterOptions.positions && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Position</label>
              <Select value={filters.position || ""} onValueChange={(value) => onFilterChange("position", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Positions" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.positions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {filterOptions.players && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Player</label>
              <Select value={filters.player || ""} onValueChange={(value) => onFilterChange("player", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Players" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.players.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {activeFilters.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Active Filters</label>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(([key, value]) => (
                <Badge
                  key={key}
                  variant="secondary"
                  className="flex items-center gap-1 pr-1"
                >
                  <span className="text-xs font-medium capitalize">{key}:</span>
                  <span className="text-xs">{value}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-secondary-foreground/10"
                    onClick={() => clearFilter(key)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilterPanel;