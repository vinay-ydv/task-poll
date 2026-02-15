# Two Anti-Abuse Mechanisms:

1 .One vote per user (cookie-based identity)
Each voter gets a unique voterId stored in cookies.

2.Prevents repeat voting from the same browser session.
IP-based vote restriction
The server stores the IP address of voters.



# Edge Cases Handled

User refreshes page after voting → vote state persists (based on cookie/IP).
User tries to vote multiple times will receives 403 error and UI disables voting.
Less than 2 valid options when creating poll → validation prevents submission.
Empty option fields removed before poll creation.
Real-time vote updates sync across all connected users via sockets.


# Known Limitations / Future Improvements :

IP-based restriction is not fully reliable (shared networks, VPNs).
Cookie identity can be bypassed by clearing browser data.
No user authentication 
No poll closing feature.
Data visualization (charts, percentages) not implemented.
No persistent analytics or vote history tracking.

# Possible Next Improvements

Add authentication.
Add poll expiry time.
Show vote percentages and charts.
Restrict poll editing to creator.
