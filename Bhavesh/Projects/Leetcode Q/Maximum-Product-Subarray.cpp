1class Solution {
2public:
3    int maxProduct(vector<int>& nums) {
4        if(nums.empty()) return 0;
5        int ans = nums[0];
6        int Pmul = nums[0];
7        int Nmul = nums[0];
8
9        for(int i = 1; i < nums.size(); i++) {
10            int x = nums[i];
11
12            if(x < 0) swap(Pmul, Nmul);
13            
14            Pmul = max(x, Pmul*x);
15            Nmul = min(x, Nmul*x);
16
17            ans = max(ans, Pmul);
18        }
19
20        return ans;
21    }
22};