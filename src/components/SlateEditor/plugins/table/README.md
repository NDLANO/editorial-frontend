# Table plugin

## Matrix explanation

The JSON representation of a table in Slate is similar to a table in HTML. A problem with this is that it is not easy to validate.

```
HTML
<table>
    <tbody>
        <tr>
            <td rowspan="2">1</td>
            <td>2</td>
        </tr>
        <tr>
            <td>3</td>
        </tr>
    </tbody>
</table>
```

The same data in slate is represented by two rows.

```
[1 (height: 2), 2]
[3]
```

Looking at the second row there is no metadata to indicate that the first row has a cell expanding over multiple rows. The solution used to solve this is to build up an alternate matrix that visually is identical to what we see. This will also make us able to insert new rows and columns and make other manipulations.

```
[1, 2]
[1, 3]
```

The function `getTableAsMatrix` solves this. It iterates over all the rows, inserting cells from one row at a time. For the table used in this examples, the steps looks like this:

```
After insertion of first row:
[1, 2]
[1]

After insertion of second row:
[1, 2]
[1, 3]

```

If the result produced is not a perfect table, e.g. missing cells or differences in width, the normalization will fix it.

## Thoughts

### Performance

Building and normalizing the matrix happens on every change in the table. That is way more often than necessary, but the performance seems ok even for large tables. Can also consider memoizing of the matrix to improve performance as it SHOULD only be required on changing of colspan, rowspan and adding/removing cells.

### Normalizing

This is by far the most complicated code and is only necessary as some stored tables are corrupt. As long as the html editor is available and allows manipulating html tables directly AND we want to be able to consistently insert new rows and columns, there is no nice way around having normalization.

### Matrix

The data structure of a matrix representation is more readable for a human and makes it easier to do manipulations and validate the table format. The only reason why need this is because of colspan and rowspan which makes it diffucult to identify which cell is neighbour to which. Without it the datastructure of slate would be almost identical to the matrix.
