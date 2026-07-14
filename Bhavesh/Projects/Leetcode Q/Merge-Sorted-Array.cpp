1class Solution {
2public:
3    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
4        int i = m-1, j = n-1;
5        int k = m+n-1;
6        vector<int> ans(k+1, 0);
7
8        while(i >= 0 || j >= 0) {
9            if(i >= 0 && j >= 0) {
10                if(nums1[i] < nums2[j]) ans[k--] = nums2[j--];
11                else ans[k--] = nums1[i--];
12                continue;
13            }
14
15            if(i >= 0) {
16                ans[k--] = nums1[i--];
17                continue;
18            } else {
19                ans[k--] = nums2[j--];
20                continue;
21            }
22        }
23
24        nums1 = ans;
25    }
26};