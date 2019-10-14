# How to find the commit that broke the site

## Synopsis

Sometimes people commit changes to the site configuration that cause
it to break. Or they delete content that they shouldn’t have, and it
needs to be recovered. This document explains how to find the commit
that broke the site and repair it.


Before reading this:

- You should be comfortable with the command line
= You should know how to clone a copy of the site using Git
- You should know how to build the site

If this is not you, don’t worry, ask Nik for help.

## Process

The high-level process is to walk back in time to a point where the
site wasn’t broken, and identify a non-broken commit.  Then
binary-search through the commits checking to see if the site is good
or bad. The good/bad state determines which side of the binary search
tree to keep looking in.

### Build the site

Start by building the site. Open a shell, change to the
`powercoders.org` directory in the working directory, and run

```shell
yarn start
```

This will build the site and open your default browser looking at the
locally built copy of the site.

Leave this command running.

### Verify the problem exists

Navigate to the page that has the problem and verify that the problem
exists.

### Identify a good revision

Open a second shell (the rest of this document refers to this as the
Git shell) and change to the `powercoders.org` working directory.

You want to find a good revision -- i.e. one where the data wasn't
deleted, or where the site was working as expected.

To do this, checkout 50 revisions ago by running 

```shell
git checkout "master@{50}"
```

in the Git shell.

The `yarn` command should automatically build and reload the
site. Check to see if the problem still exists.

If it does, try going back 100 commits, with

```shell
git checkout "master@{100}"
```

and so on, until you find a good revision.

Once you've found a good revision, note down the revision ID. In the
`git checkout` output is a line that looks like

```
HEAD is now at at XXXXXXX ...
```

The `XXXXXXX` is the revision number.

Once you've identified a good revision move on to the next step.

### Start the search for the bad revision

Go back to the most recent revision with

```shell
git checkout master
```

Now start the process of finding the bad revision.

Run the following two commands in the Git shell to start the process,
and mark the current revision as bad.

```shell
git bisect start
git bisect bad
```

Mark the commit you identified earlier as good by running

```shell
git bisect good XXXXXXX
```

### Check each commit

The previous command should have checked out a revision in the middle
of the range and tried to build the site.

When the build completes, test the site and see if the problem is
still there.

If the problem is *not* present then mark this revision as good by
running

```shell
git bisect good
```

If the problem *is* present then mark this revision as bad by running

```shell
git bisect bad
```

`git` will then choose another revision to try, and check it out. This
will cause the site to be rebuilt, and you test the site again.

Repeat this process, running `git bisect bad` or `git reset good` as
appropriate.

This will eventually narrow in on the precise commit that introduced
the problem.

### Fix the problem

Move back to the HEAD.

```shell
git bisect reset
```

Look at the details of the change introduced in the broken revision
and figure out how to fix them.

Then fix and commit as normal.
