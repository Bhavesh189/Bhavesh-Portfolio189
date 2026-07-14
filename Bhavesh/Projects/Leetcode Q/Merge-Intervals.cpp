1class Solution {
2public:
3    vector<vector<int>> merge(vector<vector<int>>& intervals) {
4        sort(intervals.begin(), intervals.end());
5
6        vector<vector<int>> ans;
7        sort(intervals.begin(), intervals.end());
8        ans.push_back(intervals[0]);
9
10        for(int i = 1; i < intervals.size(); i++) {
11            if(intervals[i][0] <= ans.back()[1]) {
12                ans.back()[1] = max(ans.back()[1], intervals[i][1]);
13            } else {
14                ans.push_back(intervals[i]);
15            }
16        }
17
18        return ans;
19    }
20};