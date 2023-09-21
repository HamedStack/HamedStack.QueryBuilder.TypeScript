/**
 * Enumeration representing query operators (e.g., AND, OR, XOR).
 */
export enum Operator {
  And,
  Or,
  Xor
}

/**
 * Enumeration representing query filters (e.g., Equal, GreaterThan, Contains).
 */
export enum Filter {
  Equal,
  NotEqual,
  GreaterOrEqual,
  LessOrEqual,
  GreaterThan,
  LessThan,
  StartsWith,
  EndsWith,
  DoesNotStartWith,
  DoesNotEndWith,
  Contains,
  DoesNotContain,
  IsNull,
  NotNull,
  Matches,
  DoesNotMatch,
  In,
  NotIn,
  All,
  Any
}

/**
 * Represents a query for filtering data.
 */
export interface Query {
  /**
   * The logical operator to combine multiple conditions (e.g., AND, OR).
   * Optional because it may not be needed in all queries.
   */
  Operator?: Operator;

  /**
   * Indicates whether to negate the query condition.
   * Required, must be explicitly set to `true` or `false`.
   */
  Not: boolean;

  /**
   * The property or field to filter on.
   * Optional because not all queries require specifying a property.
   */
  Property?: string;

  /**
   * The filter condition to apply to the property.
   * Required, must be one of the predefined filter options.
   */
  Filter?: Filter;

  /**
   * The value to compare with the property based on the filter condition.
   * Optional because not all queries require specifying a value.
   */
  Value?: any;

  /**
   * Nested queries to build complex conditions.
   * Optional because not all queries require nested conditions.
   */
  Queries?: Query[];
}

/**
 * Builder class for creating query objects.
 */
export class QueryBuilder {
  private currentQuery: Query;

  /**
   * Initializes a new instance of the QueryBuilder.
   * @param condition The initial logical operator (default: AND).
   */
  constructor(condition: Operator = Operator.And) {
    this.currentQuery = { Not: false };
    if (condition) {
      this.currentQuery.Operator = condition;
    }
  }

  /**
   * Sets the logical operator to AND.
   * @returns The QueryBuilder instance for method chaining.
   */
  public and(): QueryBuilder {
    this.currentQuery.Operator = Operator.And;
    return this;
  }

  /**
   * Sets the logical operator to OR.
   * @returns The QueryBuilder instance for method chaining.
   */
  public or(): QueryBuilder {
    this.currentQuery.Operator = Operator.Or;
    return this;
  }

  /**
   * Sets the logical operator to XOR.
   * @returns The QueryBuilder instance for method chaining.
   */
  public xor(): QueryBuilder {
    this.currentQuery.Operator = Operator.Xor;
    return this;
  }

  /**
   * Adds a simple condition to the query.
   * @param property The property or field to filter on.
   * @param filter The filter condition to apply.
   * @param value The value to compare with the property.
   * @returns The QueryBuilder instance for method chaining.
   */
  public add(property: string, filter: Filter, value?: any): QueryBuilder {
    const query: Query = {
      Property: property,
      Filter: filter,
      Value: value,
      Not: false
    };
    if (!this.currentQuery.Queries) {
      this.currentQuery.Queries = [];
    }
    this.currentQuery.Queries.push(query);
    return this;
  }

  /**
   * Adds a group of conditions to the query.
   * @param groupAction A function that defines a group of conditions using another QueryBuilder instance.
   * @param condition The logical operator to combine the group (default: AND).
   * @returns The QueryBuilder instance for method chaining.
   */
  public group(groupAction: (qb: QueryBuilder) => void, condition: Operator = Operator.And): QueryBuilder {
    const group = new QueryBuilder(condition);
    groupAction(group);
    if (!this.currentQuery.Queries) {
      this.currentQuery.Queries = [];
    }
    this.currentQuery.Queries.push(group.build());
    return this;
  }

  /**
   * Builds and returns the query object.
   * @returns The Query object representing the built query.
   */
  public build(): Query {
    return this.currentQuery;
  }
}

