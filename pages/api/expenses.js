// API route for expenses - replace with your database logic
// This is a placeholder for when you connect a real database

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // TODO: Fetch expenses from database
      // Example with Prisma: const expenses = await prisma.expense.findMany({ where: { userId: req.user.id } })
      res.status(200).json({ expenses: [] });
      break;

    case 'POST':
      // TODO: Create new expense in database
      // Example: const expense = await prisma.expense.create({ data: req.body })
      res.status(201).json({ message: 'Expense created' });
      break;

    case 'PUT':
      // TODO: Update expense in database
      res.status(200).json({ message: 'Expense updated' });
      break;

    case 'DELETE':
      // TODO: Delete expense from database
      res.status(200).json({ message: 'Expense deleted' });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
