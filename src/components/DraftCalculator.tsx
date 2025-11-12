import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Hero {
  id: string;
  name: string;
  role: string;
  tier: 'S' | 'A' | 'B' | 'C';
  counters: string[];
  counteredBy: string[];
  icon: string;
}

const heroesData: Hero[] = [
  { id: '1', name: 'Lancelot', role: 'Assassin', tier: 'S', counters: ['miya', 'layla'], counteredBy: ['saber', 'natalia'], icon: '⚔️' },
  { id: '2', name: 'Fanny', role: 'Assassin', tier: 'S', counters: ['marksman'], counteredBy: ['tigreal', 'khufra'], icon: '🗡️' },
  { id: '3', name: 'Ling', role: 'Assassin', tier: 'S', counters: ['mages'], counteredBy: ['cyclops'], icon: '🥷' },
  { id: '4', name: 'Gusion', role: 'Assassin', tier: 'A', counters: ['mm'], counteredBy: ['gatotkaca'], icon: '🔪' },
  { id: '5', name: 'Tigreal', role: 'Tank', tier: 'A', counters: ['fanny', 'assassins'], counteredBy: ['khufra'], icon: '🛡️' },
  { id: '6', name: 'Khufra', role: 'Tank', tier: 'S', counters: ['fanny', 'mobility'], counteredBy: ['karrie'], icon: '⚡' },
  { id: '7', name: 'Gatotkaca', role: 'Tank', tier: 'A', counters: ['physical'], counteredBy: ['karrie'], icon: '💪' },
  { id: '8', name: 'Yve', role: 'Mage', tier: 'S', counters: ['melee'], counteredBy: ['assassins'], icon: '🌟' },
  { id: '9', name: 'Valentina', role: 'Mage', tier: 'S', counters: ['ultimate'], counteredBy: ['early'], icon: '👑' },
  { id: '10', name: 'Pharsa', role: 'Mage', tier: 'A', counters: ['low-mobility'], counteredBy: ['assassins'], icon: '🦅' },
  { id: '11', name: 'Beatrix', role: 'Marksman', tier: 'S', counters: ['tanks'], counteredBy: ['assassins'], icon: '🎯' },
  { id: '12', name: 'Wanwan', role: 'Marksman', tier: 'S', counters: ['tanks'], counteredBy: ['cc'], icon: '🏹' },
  { id: '13', name: 'Moskov', role: 'Marksman', tier: 'A', counters: ['tanks'], counteredBy: ['burst'], icon: '🔫' },
  { id: '14', name: 'Estes', role: 'Support', tier: 'S', counters: ['poke'], counteredBy: ['anti-heal'], icon: '💚' },
  { id: '15', name: 'Mathilda', role: 'Support', tier: 'A', counters: ['melee'], counteredBy: ['cc'], icon: '✨' },
  { id: '16', name: 'Chou', role: 'Fighter', tier: 'S', counters: ['mages'], counteredBy: ['cc'], icon: '🥋' },
  { id: '17', name: 'Paquito', role: 'Fighter', tier: 'A', counters: ['squishy'], counteredBy: ['kite'], icon: '🥊' },
  { id: '18', name: 'Fredrinn', role: 'Fighter', tier: 'S', counters: ['physical'], counteredBy: ['true-damage'], icon: '🔨' },
];

export default function DraftCalculator() {
  const [blueBans, setBlueBans] = useState<string[]>([]);
  const [redBans, setRedBans] = useState<string[]>([]);
  const [bluePicks, setBluePicks] = useState<string[]>([]);
  const [redPicks, setRedPicks] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [phase, setPhase] = useState<'ban' | 'pick'>('ban');

  const roles = ['All', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];

  const filteredHeroes = heroesData.filter(hero => 
    selectedRole === 'All' || hero.role === selectedRole
  );

  const getCounterSuggestions = (enemyPicks: string[]) => {
    const suggestions = new Map<string, number>();
    
    enemyPicks.forEach(pickId => {
      const enemy = heroesData.find(h => h.id === pickId);
      if (enemy) {
        enemy.counteredBy.forEach(counterId => {
          suggestions.set(counterId, (suggestions.get(counterId) || 0) + 1);
        });
      }
    });

    return Array.from(suggestions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const handleHeroClick = (heroId: string, team: 'blue' | 'red') => {
    if (phase === 'ban') {
      if (team === 'blue') {
        if (blueBans.includes(heroId)) {
          setBlueBans(blueBans.filter(id => id !== heroId));
        } else if (blueBans.length < 3) {
          setBlueBans([...blueBans, heroId]);
        }
      } else {
        if (redBans.includes(heroId)) {
          setRedBans(redBans.filter(id => id !== heroId));
        } else if (redBans.length < 3) {
          setRedBans([...redBans, heroId]);
        }
      }
    } else {
      if (team === 'blue') {
        if (bluePicks.includes(heroId)) {
          setBluePicks(bluePicks.filter(id => id !== heroId));
        } else if (bluePicks.length < 5) {
          setBluePicks([...bluePicks, heroId]);
        }
      } else {
        if (redPicks.includes(heroId)) {
          setRedPicks(redPicks.filter(id => id !== heroId));
        } else if (redPicks.length < 5) {
          setRedPicks([...redPicks, heroId]);
        }
      }
    }
  };

  const isHeroBanned = (heroId: string) => {
    return blueBans.includes(heroId) || redBans.includes(heroId);
  };

  const isHeroPicked = (heroId: string) => {
    return bluePicks.includes(heroId) || redPicks.includes(heroId);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S': return 'bg-secondary text-secondary-foreground glow-gold';
      case 'A': return 'bg-primary text-primary-foreground glow-cyan';
      case 'B': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const counterSuggestions = getCounterSuggestions(redPicks);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 text-primary">DRAFT CALCULATOR</h1>
          <p className="text-muted-foreground text-lg">Mobile Legends Pro Draft Tool</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <Card className="p-6 border-primary/30 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-primary glow-cyan"></div>
              <h2 className="text-2xl font-bold text-primary">BLUE TEAM</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">BANS ({blueBans.length}/3)</h3>
                <div className="flex gap-2 flex-wrap min-h-[60px]">
                  {blueBans.map(banId => {
                    const hero = heroesData.find(h => h.id === banId);
                    return hero ? (
                      <div key={banId} className="relative group">
                        <div className="w-14 h-14 bg-destructive/20 border-2 border-destructive rounded-lg flex items-center justify-center text-2xl hero-glow cursor-pointer"
                             onClick={() => handleHeroClick(banId, 'blue')}>
                          {hero.icon}
                        </div>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {hero.name}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">PICKS ({bluePicks.length}/5)</h3>
                <div className="flex gap-2 flex-wrap min-h-[80px]">
                  {bluePicks.map(pickId => {
                    const hero = heroesData.find(h => h.id === pickId);
                    return hero ? (
                      <div key={pickId} className="relative group">
                        <div className="w-16 h-16 bg-primary/20 border-2 border-primary rounded-lg flex flex-col items-center justify-center hero-glow cursor-pointer"
                             onClick={() => handleHeroClick(pickId, 'blue')}>
                          <span className="text-2xl">{hero.icon}</span>
                          <Badge className={`text-xs mt-1 ${getTierColor(hero.tier)}`}>{hero.tier}</Badge>
                        </div>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {hero.name}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-destructive/30 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-destructive glow-red"></div>
              <h2 className="text-2xl font-bold text-destructive">RED TEAM</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">BANS ({redBans.length}/3)</h3>
                <div className="flex gap-2 flex-wrap min-h-[60px]">
                  {redBans.map(banId => {
                    const hero = heroesData.find(h => h.id === banId);
                    return hero ? (
                      <div key={banId} className="relative group">
                        <div className="w-14 h-14 bg-destructive/20 border-2 border-destructive rounded-lg flex items-center justify-center text-2xl hero-glow cursor-pointer"
                             onClick={() => handleHeroClick(banId, 'red')}>
                          {hero.icon}
                        </div>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {hero.name}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">PICKS ({redPicks.length}/5)</h3>
                <div className="flex gap-2 flex-wrap min-h-[80px]">
                  {redPicks.map(pickId => {
                    const hero = heroesData.find(h => h.id === pickId);
                    return hero ? (
                      <div key={pickId} className="relative group">
                        <div className="w-16 h-16 bg-destructive/20 border-2 border-destructive rounded-lg flex flex-col items-center justify-center hero-glow cursor-pointer"
                             onClick={() => handleHeroClick(pickId, 'red')}>
                          <span className="text-2xl">{hero.icon}</span>
                          <Badge className={`text-xs mt-1 ${getTierColor(hero.tier)}`}>{hero.tier}</Badge>
                        </div>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {hero.name}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {redPicks.length > 0 && (
          <Card className="p-6 mb-6 border-secondary/30 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Lightbulb" className="text-secondary" size={24} />
              <h3 className="text-xl font-bold text-secondary">COUNTER SUGGESTIONS</h3>
            </div>
            <div className="flex gap-2 flex-wrap">
              {counterSuggestions.map(([heroName, count]) => {
                const hero = heroesData.find(h => h.name.toLowerCase() === heroName.toLowerCase());
                return hero && !isHeroBanned(hero.id) && !isHeroPicked(hero.id) ? (
                  <div key={hero.id} className="relative group">
                    <div className="w-16 h-16 bg-secondary/20 border-2 border-secondary rounded-lg flex flex-col items-center justify-center hero-glow cursor-pointer"
                         onClick={() => handleHeroClick(hero.id, 'blue')}>
                      <span className="text-2xl">{hero.icon}</span>
                      <Badge className="text-xs mt-1 bg-secondary text-secondary-foreground">+{count}</Badge>
                    </div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {hero.name}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </Card>
        )}

        <Card className="p-6 bg-card/50 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">HERO POOL</h3>
            <div className="flex gap-2">
              <Button
                variant={phase === 'ban' ? 'default' : 'outline'}
                onClick={() => setPhase('ban')}
                className="gap-2"
              >
                <Icon name="Ban" size={16} />
                BAN PHASE
              </Button>
              <Button
                variant={phase === 'pick' ? 'default' : 'outline'}
                onClick={() => setPhase('pick')}
                className="gap-2"
              >
                <Icon name="UserCheck" size={16} />
                PICK PHASE
              </Button>
            </div>
          </div>

          <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-4">
              {roles.map(role => (
                <TabsTrigger key={role} value={role}>{role}</TabsTrigger>
              ))}
            </TabsList>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
              {filteredHeroes.map(hero => {
                const isBanned = isHeroBanned(hero.id);
                const isPicked = isHeroPicked(hero.id);
                const isDisabled = isBanned || isPicked;
                
                return (
                  <div
                    key={hero.id}
                    className={`relative group ${isDisabled ? 'opacity-30' : ''}`}
                  >
                    <div
                      className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center gap-1 p-2 border-2 transition-all ${
                        isDisabled 
                          ? 'bg-muted border-muted cursor-not-allowed' 
                          : 'bg-card border-border hover:border-primary cursor-pointer hero-glow'
                      }`}
                      onClick={() => !isDisabled && handleHeroClick(hero.id, 'blue')}
                    >
                      <span className="text-3xl">{hero.icon}</span>
                      <Badge className={`text-xs ${getTierColor(hero.tier)}`}>{hero.tier}</Badge>
                      {isBanned && <Icon name="Ban" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-destructive" size={32} />}
                    </div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {hero.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </Tabs>
        </Card>

        <div className="mt-6 flex justify-center gap-4">
          <Button
            variant="destructive"
            onClick={() => {
              setBlueBans([]);
              setRedBans([]);
              setBluePicks([]);
              setRedPicks([]);
              setPhase('ban');
            }}
            className="gap-2"
          >
            <Icon name="RotateCcw" size={16} />
            RESET DRAFT
          </Button>
        </div>
      </div>
    </div>
  );
}
