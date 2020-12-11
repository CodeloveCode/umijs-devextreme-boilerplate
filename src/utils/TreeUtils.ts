/**
 * Hierarchical Tree Structure.
 * 树形数据.必备属性.
 * 由于后台是长整形主键,为防止精度丢失,前端会用string接收.
 */
export interface ITreeData {
  id: string;
  children?: ITreeData[];
}

/**
 * Plain Tree Structure.
 * 树形数据.必备属性.
 * 由于后台是长整形主键,为防止精度丢失,前端会用string接收.
 */
export interface IPlainTreeData {
  children?: ITreeData[];
}

/**
 * Plain Structure.
 * 树形的扁平化数据.必备属性.
 * 由于后台是长整形主键,为防止精度丢失,前端会用string接收.
 */
export interface IFlatData {
  id: string;
  parent_id: string;
}

export class TreeUtils {
  /**
   * 将树形的数据转为普通数据.
   * @param tree 
   * @param list 
   */
  static treeToSimpleList(tree: IPlainTreeData, list: any[]) {
    const { children, ...other } = tree;

    list.push({ ...other });

    if (tree.children && tree.children.length > 0) {
      tree.children.forEach(value =>
        TreeUtils.treeToSimpleList(value, list),
      );
    }
  }


  /**
   * Tree to List.
   * 转为带parent_id的数组.parent_id指向父级的id.
   */
  static treeToHierarchyList(
    tree: ITreeData,
    list: IFlatData[],
    parent_id: string = '0',
  ) {
    const { children, ...other } = tree;

    list.push({ parent_id, ...other });

    if (tree.children && tree.children.length > 0) {
      tree.children.forEach(value =>
        TreeUtils.treeToHierarchyList(value, list, tree.id),
      );
    }
  }

  static findAllChild(
    list: IFlatData[],
    father: IFlatData,
    childs: IFlatData[],
  ) {
    const currChilds = list.filter(item => item.parent_id == father.id) ?? [];
    if (currChilds.length > 0) {
      childs.push(...currChilds);
      currChilds.forEach(child => {
        TreeUtils.findAllChild(list, child, childs);
      });
    }
  }

  /**
   * 将IFlatData结构的数组,转为ITreeData结构的数据.
   * @param {IFlatData[]} plainList
   */
  static listToTree(plainList: IFlatData[]): ITreeData[] {
    // 1.遍历plainList的每一个元素item
    // 2.找到一个或多个根节点root(约定root.parent_id为0)
    // 3.,存入root的children.递归调用直到叶子节点.
    // 4.将组装好的root存入treeList

    const treeList: ITreeData[] = [];

    plainList.forEach(item => {
      if ('0' === item.parent_id) {
        treeList.push(TreeUtils.findChildren(item, plainList));
      }
    });

    return treeList;
  }

  static findChildren(parent: ITreeData, plainList: IFlatData[]) {
    // 1.遍历plainList,找node的子节点(child.parent_id===root.id)
    // 2.使用findChildren,递归找子节点的children
    // 3.将子节点存入node的children数组.
    // 4.返回node.
    plainList.forEach(item => {
      if (item.parent_id === parent.id) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(TreeUtils.findChildren(item, plainList));
      }
    });
    return parent;
  }

  /**
   * 在ITreeData类型数据中找指定的父节点.
   * @param parentId
   * @param tree
   */
  static findParentInTree(
    parentId: string,
    tree: ITreeData,
  ): ITreeData | undefined {
    let parent = undefined;

    if (tree.id === parentId) {
      parent = tree;
    } else {
      if (tree.children && tree.children.length > 0) {
        for (let childTree of tree.children) {
          parent = TreeUtils.findParentInTree(parentId, childTree);
          if (parent) {
            break;
          }
        }
      }
    }
    return parent;
  }

  /**
   * 在IFlatData结构的tree中查找指定节点的所有的祖先节点.
   * @param treeList 树的线性数组.
   * @param node 指定节点.
   */
  static findAncestors(treeList: IFlatData[], node: IFlatData) {
    let ancestors = new Set<any>(); // 防止不同的子,有同一个祖先,造成重复添加.

    TreeUtils.findParent(treeList, node, ancestors);

    return Array.from(ancestors);
  }

  /**
   * 在IFlatData结构的tree中找指定节点的parent,并存入容器.
   * @param treeList 树的线性数组.
   * @param node 指定节点.
   * @param ancestors 容器
   */
  static findParent(
    treeList: IFlatData[],
    node: IFlatData,
    ancestors: Set<any>,
  ) {
    let parent = treeList.find(item => item.id === node.parent_id);
    if (parent) {
      ancestors.add(parent);
      TreeUtils.findParent(treeList, parent, ancestors);
    }
  }
}
