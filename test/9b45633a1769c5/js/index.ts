function collatz ( i )
{
    let cnt = 0;
    while (i != 1n)
    {
        cnt++;
        if (i % 2n == 0n)
        {
            i /= 2n;
        }
        else
        {
            i *= 3n;
            i += 1n;
        }
    }
    return cnt;
}
for ( let i = 0n; i < 1000000000000000000n; i++ )
{
    console.log( collatz(i) )
}