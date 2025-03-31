class Parent {
  constructor(father, mother) {
    this.parent = father + mother;
  }
}
const myParent = new Parent(1, 2);
console.log(myParent.parent);
