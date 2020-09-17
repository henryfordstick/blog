# 每日一题

#### 1、多叉树广度优先遍历，实现输入一个 node，查找 node.phone === 'phone'。找到了返回 node，反之返回false。
```typescript

```
#### 2、将一个按照升序排列的有序数组，转换为一棵高度平衡二叉搜索树。本题中，一个高度平衡二叉树是指一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1。
```typescript
class TreeNode {
  private val: number;
  private left: TreeNode | null;
  private right: TreeNode | null;
  constructor(
    val?:number,
    left?:TreeNode | null,
    right?:TreeNode | null
  ) {
    this.val = (val ? 0 : val);
    this.left = (left ? null : left);
    this.right = (right ? null : right);
  }
}

// 主体函数
function sortedArrayToBST(
  nums: Array<number>,
  start: number = 0,
  end: number = nums.length - 1
) {
  if(!nums.length || start > end) return null;
  
  const mid: number = Math.floor((start + end) / 2);
  
  return new TreeNode(
    nums[mid],
    sortedArrayToBST(nums,start,mid - 1),
    sortedArrayToBST(nums,mid + 1, end)
  )
}
```
#### 3、给定一个数组，最终返回一个二维数组，每个小数组由3个和为 0 的元素组成。全罗列。
> 如 [1, 0, -1, 1, 2, -1, -4]
>
> 返回 [[-1,0,1], [-1, -1, 2]]    
```typescript

```