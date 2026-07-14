class NumArray {
public:

    void build(int i, int l, int r, vector<int>& arr) {
        if(l == r) {
            seg[i] = arr[l];
            return;
        }

        int mid = l + (r-l)/2;

        build(2*i+1, l, mid, arr);
        build(2*i+2, mid+1, r, arr);

        seg[i] = seg[2*i+1] + seg[2*i+2];
    }

    void update(int i, int l, int r, vector<int>& arr, int idx, int val) {
        if(l == r) {
            seg[i] = val;
            return;
        }

        int mid = l + (r-l)/2;

        if(idx <= mid) update(2*i+1, l, mid, arr, idx, val);
        else update(2*i+2, mid+1, r, arr, idx, val);

        seg[i] = seg[2*i+1] + seg[2*i+2];
    }

    int query(int i, int l, int r, int ql, int qr) {
        if(l > qr || r < ql) return 0;

        if(l >= ql && r <= qr) return seg[i];

        int mid = l + (r-l)/2;

        int x = query(2*i+1, l, mid, ql, qr);
        int y = query(2*i+2, mid+1, r, ql, qr);

        return x+y;
    }



    vector<int> seg;
    int rx  = 0;
    vector<int> num;
    NumArray(vector<int>& nums) {
        num = nums;
        seg.assign(nums.size()*4, 0);
        rx = nums.size()-1;
        build(0, 0, rx, nums);
    }
    
    void update(int index, int val) {
        update(0, 0, rx, num, index, val);
    }
    
    int sumRange(int left, int right) {
        return query(0, 0, rx, left, right);
    }
};

/**
 * Your NumArray object will be instantiated and called as such:
 * NumArray* obj = new NumArray(nums);
 * obj->update(index,val);
 * int param_2 = obj->sumRange(left,right);
 */