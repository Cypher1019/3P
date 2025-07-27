import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Users, Trophy, Loader2 } from "lucide-react";
import ChartCard from "@/components/ui/chart-card";
import { useNBAData } from "@/hooks/useNBAData";
import { getTopPlayers, calculateLeagueAverages } from "@/data/nbaDataService";

const Dashboard = () => {
  const { players, loading, error } = useNBAData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading NBA data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading data: {error}</p>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  // Calculate key statistics from real data
  const leagueStats = calculateLeagueAverages(players);
  const top3PA = getTopPlayers(players, 'FG3A', 1)[0];
  const top3PM = getTopPlayers(players, 'FG3M', 1)[0];
  const top3PPercentage = getTopPlayers(players, 'FG3_PCT', 1)[0];

  const statsCards = [
    {
      title: "Total 3PA",
      value: leagueStats.total3PA.toLocaleString(),
      description: "Three-point attempts all-time",
      icon: Target,
      color: "text-primary"
    },
    {
      title: "League Average",
      value: `${leagueStats.avg3PPercentage.toFixed(1)}%`,
      description: "3-point shooting percentage",
      icon: TrendingUp,
      color: "text-stats-green"
    },
    {
      title: "Top Shooter",
      value: `${top3PPercentage?.FG3_PCT.toFixed(1)}%`,
      description: top3PPercentage?.PLAYER_NAME || "N/A",
      icon: Trophy,
      color: "text-primary"
    },
    {
      title: "Active Players",
      value: leagueStats.totalPlayers.toString(),
      description: "In our database",
      icon: Users,
      color: "text-court-blue"
    }
  ];

  // Get top 10 players for different metrics
  const top10Attempts = getTopPlayers(players, 'FG3A', 10);
  const top10Made = getTopPlayers(players, 'FG3M', 10);
  const top10Percentage = getTopPlayers(players, 'FG3_PCT', 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
            NBA 3-Point Revolution
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the evolution of three-point shooting in the NBA through interactive data visualizations
            and comprehensive analytics using real NBA statistics.
          </p>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ChartCard
            title="All-Time Leaders"
            description="Top performers in NBA history"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">Most Attempts</p>
                  <p className="text-sm text-muted-foreground">
                    {top3PA?.PLAYER_NAME || "N/A"} - {top3PA?.FG3A.toLocaleString() || 0} attempts
                  </p>
                </div>
                <div className="text-primary font-bold text-xl">
                  {top3PA?.FG3A.toLocaleString() || 0}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">Best Percentage</p>
                  <p className="text-sm text-muted-foreground">
                    {top3PPercentage?.PLAYER_NAME || "N/A"} - {top3PPercentage?.FG3_PCT.toFixed(1) || 0}%
                  </p>
                </div>
                <div className="text-stats-green font-bold text-xl">
                  {top3PPercentage?.FG3_PCT.toFixed(1) || 0}%
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">Most Made</p>
                  <p className="text-sm text-muted-foreground">
                    {top3PM?.PLAYER_NAME || "N/A"} - {top3PM?.FG3M.toLocaleString() || 0} made
                  </p>
                </div>
                <div className="text-primary font-bold text-xl">
                  {top3PM?.FG3M.toLocaleString() || 0}
                </div>
              </div>
            </div>
          </ChartCard>

          <ChartCard
            title="Top 10 - 3PT Attempts"
            description="Players with most three-point attempts"
          >
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {top10Attempts.map((player, index) => (
                <div key={player.PLAYER_ID} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
                      ${index === 0 ? 'bg-primary' : index === 1 ? 'bg-stats-green' : 'bg-court-blue'}`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{player.PLAYER_NAME}</p>
                      <p className="text-sm text-muted-foreground">
                        {player.FG3M.toLocaleString()}/{player.FG3A.toLocaleString()} 3PM/A
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">{player.FG3_PCT.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Quick Access Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-primary">
                <Target className="h-5 w-5" />
                <span>3PT Explorer</span>
              </CardTitle>
              <CardDescription>
                Analyze all-time 3-point statistics with interactive filters
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gradient-to-br from-stats-green/5 to-stats-green/10 border-stats-green/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-stats-green">
                <TrendingUp className="h-5 w-5" />
                <span>Player Evolution</span>
              </CardTitle>
              <CardDescription>
                Track individual player 3-point performance over time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gradient-to-br from-court-blue/5 to-court-blue/10 border-court-blue/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-court-blue">
                <Trophy className="h-5 w-5" />
                <span>Timeline</span>
              </CardTitle>
              <CardDescription>
                Explore the historical evolution of 3-point shooting
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gradient-to-br from-muted/5 to-muted/10 border-muted/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <Users className="h-5 w-5" />
                <span>Comparison</span>
              </CardTitle>
              <CardDescription>
                Compare players and teams side-by-side
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;