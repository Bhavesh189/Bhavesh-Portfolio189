1class Solution {
2public:
3    vector<vector<int>> fourSum(vector<int>& nums, int target) {
4        int n = nums.size();
5        sort(nums.begin(), nums.end());
6        vector<vector<int>> ans;
7
8        if(n < 4) return ans;
9
10        for(int i = 0; i < n-3; i++) {
11            if(i > 0 && nums[i] == nums[i-1]) continue;
12            long long a = nums[i];
13            
14            for(int j = i+1; j < n-2; j++) {
15                if(j > i+1 && nums[j] == nums[j-1]) continue;
16                long long b = nums[j];
17
18                int l = j+1, r = n-1;
19
20                while(l < r) {
21                    long long c = nums[l];
22                    long long d = nums[r];
23
24                    if(a+b+c+d == target) {
25                        ans.push_back({(int)a, (int)b, (int)c, (int)d});
26                        
27                        while(l < r && nums[l] == nums[l+1]) l++;
28                        while(l < r && nums[r] == nums[r-1]) r--;
29
30                        l++;
31                        r--;
32                    }
33                    else if(a+b+c+d < target) l++;
34                    else r--;
35                }
36            }
37        }
38
39        return ans;        
40    }
41};