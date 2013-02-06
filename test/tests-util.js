/*global portviz:false*/
test("money.fmt args", function () {
    throws(function () { portviz.money.fmt('a'); });
  });
test("money.custom args", function () {
    throws(function () { portviz.money.custom('a'); });
  });
test("money.custom args", function () {
    throws(function () { portviz.money.custom('a', 'b', 'c', 'd'); });
  });
test("money.fmt", function () {
    var f = portviz.money.fmt();
    var actual = f(10);
    var expected = "10";
    equal(actual, expected);
  });

test("money.custom", function () {
    var f = portviz.money.custom(2, '.', ',');
    var actual = f(10);
    var expected = "10.00";
    equal(actual, expected);
  });

test("large money.fmt", function () {
    var f = portviz.money.fmt();
    var actual = f(123456.789);
    var expected = "123,457";
    equal(actual, expected);
  });

test("large money.custom", function () {
    var f = portviz.money.custom(2, '.', ',');
    var actual = f(123456.789);
    var expected = "123,456.79";
    equal(actual, expected);
  });

test("rand", function () {
    var r = portviz.boxmuller.newInstance();
    var rr = r.random();
    ok(!isNaN(rr));
  });

test("rand seeded", function () {
    var r1 = portviz.boxmuller.newInstance(1);
    var r2 = portviz.boxmuller.newInstance(1);
    var rr11 = r1.random();
    var rr21 = r2.random();
    equal(rr11, rr21);
    var rr12 = r1.random();
    var rr22 = r2.random();
    equal(rr12, rr22);
  });
