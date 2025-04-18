import React, { useState, useEffect } from 'react';
import { 
  format, 
  startOfWeek,
  startOfMonth,
  startOfYear,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  isSameDay,
  subMonths,
  subDays,
  differenceInDays,
  addDays,
  addMonths,
  isWithinInterval,
  endOfWeek,
  endOfMonth,
  endOfYear,
  parseISO
} from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2, AlertCircle, Flame } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type MoodEntry = Database['public']['Tables']['mood_entries']['Row'];
type TimePeriod = 'week' | 'month' | '6months' | 'year';

const MOOD_EMOJIS = {
  1: { emoji: '😢', label: 'Very Sad', color: 'text-red-500' },
  2: { emoji: '😕', label: 'Sad', color: 'text-orange-500' },
  3: { emoji: '😐', label: 'Neutral', color: 'text-yellow-500' },
  4: { emoji: '🙂', label: 'Happy', color: 'text-green-500' },
  5: { emoji: '😊', label: 'Very Happy', color: 'text-emerald-500' },
};

const TIME_PERIODS: { value: TimePeriod; label: string }[] = [
  { value: 'week', label: 'Weekly' },
  { value: 'month', label: 'Monthly' },
  { value: '6months', label: '6 Months' },
  { value: 'year', label: 'Yearly' },
];

const CustomYAxisTick = ({ x, y, payload }: any) => {
  const emoji = MOOD_EMOJIS[payload.value as keyof typeof MOOD_EMOJIS]?.emoji;
  return (
    <text x={x - 10} y={y} dy={4} textAnchor="end" fill="#6B7280" className="text-sm">
      {emoji}
    </text>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const moodRating = Math.round(payload[0].value);
    const { emoji, label: moodLabel } = MOOD_EMOJIS[moodRating as keyof typeof MOOD_EMOJIS];
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-900 dark:text-white font-medium">{label}</p>
        <p className="text-gray-900 dark:text-white mt-1">
          {emoji} {moodLabel}
        </p>
      </div>
    );
  }
  return null;
};

const MoodTrackerPage: React.FC = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [alreadyLoggedToday, setAlreadyLoggedToday] = useState(false);

  useEffect(() => {
    fetchMoodEntries();
  }, []);

  useEffect(() => {
    if (moodEntries.length > 0) {
      calculateStreaks();
      checkTodayEntry();
    }
  }, [moodEntries]);

  const checkTodayEntry = () => {
    const todayEntry = moodEntries.find(entry => 
      isSameDay(new Date(entry.created_at), new Date())
    );
    setAlreadyLoggedToday(!!todayEntry);
  };

  const calculateStreaks = () => {
    let current = 0;
    let longest = 0;
    let currentCount = 0;

    const sortedEntries = [...moodEntries].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    for (let i = 0; i < sortedEntries.length; i++) {
      const currentDate = new Date(sortedEntries[i].created_at);
      const expectedDate = subDays(new Date(), i);
      
      if (isSameDay(currentDate, expectedDate)) {
        currentCount++;
      } else {
        break;
      }
    }
    current = currentCount;

    currentCount = 1;
    for (let i = 1; i < sortedEntries.length; i++) {
      const prevDate = new Date(sortedEntries[i - 1].created_at);
      const currDate = new Date(sortedEntries[i].created_at);
      
      if (differenceInDays(prevDate, currDate) === 1) {
        currentCount++;
        longest = Math.max(longest, currentCount);
      } else {
        currentCount = 1;
      }
    }

    setCurrentStreak(current);
    setLongestStreak(Math.max(longest, current));
  };

  const fetchMoodEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMoodEntries(data || []);
    } catch (err) {
      console.error('Error fetching mood entries:', err);
      setError('Failed to load mood entries');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSubmit = async () => {
    if (!selectedMood) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('mood_entries').insert({
        user_id: user.id,
        mood_rating: selectedMood,
        note: note.trim() || null,
      });

      if (error) throw error;

      setSelectedMood(null);
      setNote('');
      await fetchMoodEntries();
    } catch (err) {
      console.error('Error saving mood entry:', err);
      setError('Failed to save mood entry');
    }
  };

  const handleResetEntries = async () => {
    if (!confirm('Are you sure you want to reset all mood entries? This cannot be undone.')) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated for reset');

      const { error } = await supabase
        .from('mood_entries')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setMoodEntries([]);
      setError(null);
      calculateStreaks();
      checkTodayEntry();

    } catch (err: any) {
      console.error('Error resetting mood entries:', err);
      setError(`Failed to reset mood entries: ${err.message}`);
    }
  };

  const getTimeRangeData = () => {
    const now = new Date();
    let start: Date;
    let end: Date;
    let tickFormat: string;
    let aggregationFunction: (date: Date) => Date;
    let intervalFunction: (options: { start: Date; end: Date }) => Date[];

    switch (timePeriod) {
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        tickFormat = 'EEE';
        aggregationFunction = (date) => date;
        intervalFunction = ({ start, end }) => eachDayOfInterval({ start, end });
        break;

      case 'month':
        start = startOfMonth(subDays(now, 29));
        end = now;
        tickFormat = 'MMM d';
        aggregationFunction = (date) => date;
        intervalFunction = ({ start, end }) => {
          const days = differenceInDays(end, start);
          const interval = Math.floor(days / 6);
          return Array.from({ length: 7 }, (_, i) => addDays(start, i * interval));
        };
        break;

      case '6months':
        start = subMonths(startOfMonth(now), 5);
        end = endOfMonth(now);
        tickFormat = 'MMM';
        aggregationFunction = (date) => startOfMonth(date);
        intervalFunction = ({ start, end }) => eachMonthOfInterval({ start, end });
        break;

      case 'year':
        start = startOfYear(now);
        end = endOfYear(now);
        tickFormat = 'MMM';
        aggregationFunction = (date) => startOfMonth(date);
        intervalFunction = ({ start, end }) => eachMonthOfInterval({ start, end });
        break;

      default:
        start = startOfWeek(now);
        end = now;
        tickFormat = 'EEE';
        aggregationFunction = (date) => date;
        intervalFunction = ({ start, end }) => eachDayOfInterval({ start, end });
    }

    return {
      start,
      end,
      tickFormat,
      aggregationFunction,
      intervalFunction,
    };
  };

  const getChartData = () => {
    const { start, end, tickFormat, aggregationFunction, intervalFunction } = getTimeRangeData();
    const timePoints = intervalFunction({ start, end });

    return timePoints.map(timePoint => {
      const periodStart = aggregationFunction(timePoint);
      const periodEnd = timePeriod === 'week' ? addDays(periodStart, 1) :
                       timePeriod === 'month' ? addDays(periodStart, 1) :
                       addMonths(periodStart, 1);

      const periodEntries = moodEntries.filter(entry => {
        const entryDate = parseISO(entry.created_at);
        return isWithinInterval(entryDate, { start: periodStart, end: periodEnd });
      });

      let averageMood = null;
      if (periodEntries.length > 0) {
        averageMood = periodEntries.reduce((sum, entry) => sum + entry.mood_rating, 0) / periodEntries.length;
      }

      return {
        date: format(timePoint, tickFormat),
        mood: averageMood,
      };
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Mood Tracker</h1>
          <button
            onClick={handleResetEntries}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            title="Reset all entries"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-8 justify-center">
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl">
            <Flame className="h-6 w-6 text-orange-500" />
            <div className="text-white">
              <span className="font-bold text-2xl">{currentStreak}</span>
              <span className="ml-2">Days</span>
            </div>
            <div className="text-gray-400 text-sm">Current streak</div>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl">
            <Flame className="h-6 w-6 text-purple-500" />
            <div className="text-white">
              <span className="font-bold text-2xl">{longestStreak}</span>
              <span className="ml-2">Days</span>
            </div>
            <div className="text-gray-400 text-sm">Longest streak</div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="text-xl font-semibold">How are you feeling today?</h2>
          
          {alreadyLoggedToday ? (
            <div className="text-center py-4 text-gray-600 dark:text-gray-300">
              You've already recorded your mood for today. Come back tomorrow to continue your journey! 😊
            </div>
          ) : (
            <>
              <div className="flex justify-center gap-4">
                {Object.entries(MOOD_EMOJIS).map(([rating, { emoji, label, color }]) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedMood(Number(rating))}
                    className={`p-4 rounded-xl transition-all ${
                      selectedMood === Number(rating)
                        ? 'bg-primary-100 dark:bg-primary-900/20 scale-110'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-4xl" role="img" aria-label={label}>
                      {emoji}
                    </span>
                  </button>
                ))}
              </div>

              {selectedMood && (
                <div className="space-y-4">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note (optional)"
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    rows={3}
                  />

                  <button
                    onClick={handleMoodSubmit}
                    className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors font-medium"
                  >
                    Save Mood
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
              {TIME_PERIODS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTimePeriod(value)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    timePeriod === value
                      ? 'bg-white dark:bg-gray-600 text-primary-500 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
                <XAxis 
                  dataKey="date"
                  stroke="#6B7280"
                  fontSize={12}
                  tickMargin={12}
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  domain={[1, 5]} 
                  ticks={[1, 2, 3, 4, 5]}
                  tick={<CustomYAxisTick />}
                  tickMargin={8}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#FF007A"
                  strokeWidth={2}
                  dot={{ fill: '#FF007A', r: 4 }}
                  activeDot={{ r: 6, fill: '#FF007A' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Recent Entries</h2>
          <div className="space-y-4">
            {moodEntries.slice(0, 5).map((entry) => {
              const { emoji, label } = MOOD_EMOJIS[entry.mood_rating as keyof typeof MOOD_EMOJIS];
              return (
                <div
                  key={entry.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <span className="text-2xl" role="img" aria-label={label}>
                    {emoji}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{label}</span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(entry.created_at), 'PPp')}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="mt-1 text-gray-600 dark:text-gray-300">{entry.note}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTrackerPage;