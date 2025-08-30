# Parking Lot

This is a random file to keep track of random ideas or thoughts while I work on this project to clean up later.

## Color themes?

#3AB9F7 - Sky Blue (Color of Blue Spark)
#FF81B6 - Pink Spark Color - might be closer to #FC74AE
#96D534 - Green Spark Color
#C673D9 - pretty purple, color of the "G"-ish
#723A20 - taken kindly from agnes's hair

not sure how to make this work with background colors that won't be terrible to see or look at, but we'll get there ig

## skills_meta.json order property

I'm not actually currently sure on what the order property means. It seems like it's ordering of the skills for something, but there are 50 skills that are value of "10" and 34 skills with a value of "34". So, I'm not 100% sure on this.

```typescript
import { readFileSync } from 'fs';
const skillsMeta = JSON.parse(readFileSync('./src/data/skills_meta.json', 'utf-8'));

/** Counts the number of duplicate order values in the skills_meta object. */
const orderCount: Record<number, number> = {};

Object.values(skillsMeta).forEach((meta: any) => {
  if (meta && typeof meta.order === 'number') {
    orderCount[meta.order] = (orderCount[meta.order] || 0) + 1;
  }
});

// Only keep order values that appear more than once
const duplicates: Record<number, number> = {};
for (const [order, count] of Object.entries(orderCount)) {
  if (count > 1) {
    duplicates[Number(order)] = count;
  }
}

console.log(duplicates);
```
