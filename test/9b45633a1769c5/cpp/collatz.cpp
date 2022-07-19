#include <iostream>
using ll = long long;

ll collatz(ll i)
{
    ll cnt = 0;
    while (i != 1)
    {
        cnt++;
        if (i % 2 == 0)
        {
            i /= 2;
        }
        else
        {
            i *= 3;
            i += 1;
        }
    }
    return cnt;
}
int main()
{
    for (ll i = 0; i < 100'0000'0000'0000'0000; i++)
    {
        std::cout << collatz(i) << std::endl;
    }
    return 0;
}